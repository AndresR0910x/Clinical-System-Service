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
    private static final List<AppointmentStatus> ACTIVE = List.of(AppointmentStatus.SCHEDULED,
            AppointmentStatus.RESCHEDULED);

    public boolean isFree(UUID doctorId, UUID patientId, Instant start, Instant end) {
        return !repo.doctorHasOverlap(doctorId, start, end, ACTIVE)
                && !repo.patientHasOverlap(patientId, start, end, ACTIVE);
    }

    public Instant[] nextAvailable(UUID doctorId, UUID patientId, Instant preferredStart, int durationMinutes,
            int jumps) {
        Instant start = preferredStart;
        long step = Duration.ofMinutes(defaultSlot).toSeconds();
        for (int i = 0; i < Math.max(1, jumps); i++) {
            Instant end = start.plus(Duration.ofMinutes(durationMinutes));
            if (isFree(doctorId, patientId, start, end))
                return new Instant[] { start, end };
            start = start.plusSeconds(step);
        }
        // si no se encontró en los primeros 'jumps', devolver último slot propuesto
        return new Instant[] { start, start.plus(Duration.ofMinutes(durationMinutes)) };
    }
}
