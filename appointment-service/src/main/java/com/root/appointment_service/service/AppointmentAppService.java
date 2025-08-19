package com.root.appointment_service.service;

import com.root.appointment_service.domain.*;
import com.root.appointment_service.repo.AppointmentRepository;
import com.root.appointment_service.service.remote.DoctorClient;
import com.root.appointment_service.service.remote.PatientClient;
import com.root.appointment_service.web.dto.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentAppService {

    private final AppointmentRepository repo;
    private final AvailabilityService availability;
    private final AppointmentEventPublisher events;
    private final PatientClient patients;
    private final DoctorClient doctors;

    // === Flujo existente: crear con Instant ===
    public AppointmentResponse create(@Valid CreateAppointmentRequest req) {
        var p = patients.getPatient(req.patientId());
        if (p == null) throw new IllegalArgumentException("Paciente no existe");

        UUID doctorId = req.doctorId();
        if (doctorId == null) {
            var list = doctors.findBySpecialty(req.specialty());
            if (list.isEmpty()) throw new IllegalArgumentException("No hay médicos para la especialidad");
            doctorId = UUID.fromString(String.valueOf(list.get(0).get("id")));
        } else {
            var d = doctors.getDoctor(doctorId);
            if (d == null || !String.valueOf(d.get("specialty")).equals(req.specialty().name()))
                throw new IllegalArgumentException("Médico no coincide con especialidad");
        }

        Instant start = req.startAt();
        Instant end = start.plus(Duration.ofMinutes(req.durationMinutes()));
        boolean auto = false;

        if (!availability.isFree(doctorId, req.patientId(), start, end)) {
            // Busca siguiente slot libre (manteniendo duración)
            var next = availability.nextAvailable(doctorId, req.patientId(), start, req.durationMinutes(), 10);
            start = next[0]; end = next[1]; auto = true;
        }

        var a = Appointment.builder()
                .patientId(req.patientId())
                .doctorId(doctorId)
                .specialty(req.specialty())
                .startAt(start)
                .endAt(end)
                .status(auto ? AppointmentStatus.RESCHEDULED : AppointmentStatus.SCHEDULED)
                .notes(req.notes())
                .build();
        a = repo.save(a);

        var res = toResponse(a, auto);
        events.created(res);
        return res;
    }

    // === NUEVO: crear por fecha + hora, sin auto-ajuste (falla si hay solape) ===
    public AppointmentResponse createByDate(@Valid CreateAppointmentByDateRequest req) {
        var p = patients.getPatient(req.patientId());
        if (p == null) throw new IllegalArgumentException("Paciente no existe");

        UUID doctorId = req.doctorId();
        if (doctorId == null) {
            var list = doctors.findBySpecialty(req.specialty());
            if (list.isEmpty()) throw new IllegalArgumentException("No hay médicos para la especialidad");
            doctorId = UUID.fromString(String.valueOf(list.get(0).get("id")));
        } else {
            var d = doctors.getDoctor(doctorId);
            if (d == null || !String.valueOf(d.get("specialty")).equals(req.specialty().name()))
                throw new IllegalArgumentException("Médico no coincide con especialidad");
        }

        String zoneId = (req.zone() == null || req.zone().isBlank()) ? "America/Guayaquil" : req.zone();
        ZoneId zone = ZoneId.of(zoneId);
        Instant start = req.date().atTime(req.time()).atZone(zone).toInstant();
        Instant end = start.plus(Duration.ofMinutes(req.durationMinutes()));

        if (!availability.isFree(doctorId, req.patientId(), start, end))
            throw new IllegalArgumentException("Horario no disponible (solapa con otra cita)");

        var a = Appointment.builder()
                .patientId(req.patientId())
                .doctorId(doctorId)
                .specialty(req.specialty())
                .startAt(start)
                .endAt(end)
                .status(AppointmentStatus.SCHEDULED)
                .notes(req.notes())
                .build();
        a = repo.save(a);

        var res = toResponse(a, false);
        events.created(res);
        return res;
    }

    @Transactional(readOnly = true)
    public AppointmentResponse get(UUID id) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));
        return toResponse(a, false);
    }

    public AppointmentResponse reschedule(UUID id, @Valid RescheduleRequest req) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));

        UUID doctorId = (req.doctorId() != null) ? req.doctorId() : a.getDoctorId();
        Instant start = (req.startAt() != null) ? req.startAt() : a.getStartAt();
        int minutes = (req.durationMinutes() != null) ? req.durationMinutes()
                : (int) Duration.between(a.getStartAt(), a.getEndAt()).toMinutes();
        Instant end = start.plus(Duration.ofMinutes(minutes));

        if (!availability.isFree(doctorId, a.getPatientId(), start, end))
            throw new IllegalArgumentException("Conflicto de horario");

        a.setDoctorId(doctorId);
        a.setStartAt(start);
        a.setEndAt(end);
        a.setStatus(AppointmentStatus.RESCHEDULED);
        a.setNotes(req.notes() != null ? req.notes() : a.getNotes());

        var res = toResponse(a, false);
        events.rescheduled(res);
        return res;
    }

    public void cancel(UUID id) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));
        a.setStatus(AppointmentStatus.CANCELLED);
        events.cancelled(toResponse(a, false));
    }

    // === NUEVO: disponibilidad diaria para UI de agenda ===
    @Transactional(readOnly = true)
    public AvailableSlotsResponse getAvailability(UUID doctorId,
                                                  LocalDate date,
                                                  Integer slotMinutes,
                                                  String workStart, String workEnd,
                                                  Integer durationMinutes) {
        int slots = (slotMinutes == null || slotMinutes <= 0) ? 30 : slotMinutes;
        int dur = (durationMinutes == null || durationMinutes <= 0) ? slots : durationMinutes;

        var ws = LocalTime.parse(workStart == null ? "08:00" : workStart);
        var we = LocalTime.parse(workEnd == null ? "17:00" : workEnd);

        var day = availability.getDailyAvailability(
                doctorId, date, "America/Guayaquil", slots, ws, we, dur
        );

        var reserved = day.reserved().stream()
                .map(a -> new AvailabilitySlot(a.getStartAt(), a.getEndAt()))
                .toList();

        var available = day.available().stream()
                .map(arr -> new AvailabilitySlot(arr[0], arr[1]))
                .toList();

        return new AvailableSlotsResponse(doctorId, date, slots, ws.toString(), we.toString(), reserved, available);
    }

    private AppointmentResponse toResponse(Appointment a, boolean auto) {
        return new AppointmentResponse(
                a.getId(), a.getPatientId(), a.getDoctorId(), a.getSpecialty(),
                a.getStartAt(), a.getEndAt(), a.getStatus(), a.getNotes(), auto
        );
    }

    
}
