package com.root.appointment_service.service;

import com.root.appointment_service.domain.*;
import com.root.appointment_service.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

  private final AppointmentRepository repo;

  @Value("${app.appointments.slotMinutes:30}")
  private int defaultSlot;

  private static final List<AppointmentStatus> ACTIVE =
      List.of(AppointmentStatus.SCHEDULED, AppointmentStatus.RESCHEDULED);

  public boolean isFree(UUID doctorId, UUID patientId, Instant start, Instant end) {
    return !repo.doctorHasOverlap(doctorId, start, end, ACTIVE)
        && !repo.patientHasOverlap(patientId, start, end, ACTIVE);
  }

  public Instant[] nextAvailable(UUID doctorId, UUID patientId, Instant preferredStart, int durationMinutes, int jumps){
    Instant start = preferredStart; long step = Duration.ofMinutes(defaultSlot).toSeconds();
    for(int i=0;i<Math.max(1,jumps);i++){
      Instant end = start.plus(Duration.ofMinutes(durationMinutes));
      if(isFree(doctorId, patientId, start, end)) return new Instant[]{start,end};
      start = start.plusSeconds(step);
    }
    return new Instant[]{start, start.plus(Duration.ofMinutes(durationMinutes))};
  }

  // 🔽 NUEVO: disponibilidad diaria (lista de slots libres + reservas existentes)
  public DailyAvailability getDailyAvailability(UUID doctorId,
                                                LocalDate date,
                                                String zoneId,
                                                int slotMinutes,
                                                LocalTime workStart,
                                                LocalTime workEnd,
                                                int durationMinutes) {
    ZoneId zone = ZoneId.of(zoneId == null || zoneId.isBlank() ? "America/Guayaquil" : zoneId);
    Instant dayStart = date.atStartOfDay(zone).toInstant();
    Instant dayEnd = date.plusDays(1).atStartOfDay(zone).toInstant();

    // Reservas del día (doctor)
    var reserved = repo.findByDoctorIdAndStartAtBetweenOrderByStartAt(doctorId, dayStart, dayEnd);

    // Construir slots candidatos
    List<Instant[]> slots = new ArrayList<>();
    var first = date.atTime(workStart).atZone(zone).toInstant();
    var endWork = date.atTime(workEnd).atZone(zone).toInstant();

    // Nos movemos por "slots", pero cada cita puede durar "durationMinutes"
    for (Instant s = first; s.plus(Duration.ofMinutes(durationMinutes)).compareTo(endWork) <= 0;
         s = s.plus(Duration.ofMinutes(slotMinutes))) {
      Instant e = s.plus(Duration.ofMinutes(durationMinutes));
      if (!overlapsAny(s, e, reserved)) {
        slots.add(new Instant[]{s, e});
      }
    }

    return new DailyAvailability(reserved, slots);
  }

  private boolean overlapsAny(Instant start, Instant end, List<Appointment> reserved) {
    for (var a : reserved) {
      if (start.isBefore(a.getEndAt()) && end.isAfter(a.getStartAt())) return true;
    }
    return false;
  }

  public record DailyAvailability(List<Appointment> reserved, List<Instant[]> available) {}
}