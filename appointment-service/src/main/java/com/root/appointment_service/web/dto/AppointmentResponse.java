package com.root.appointment_service.web.dto;

import com.root.appointment_service.domain.*;
import java.time.Instant;
import java.util.UUID;

public record AppointmentResponse(
        UUID id, UUID patientId, UUID doctorId, Specialty specialty,
        Instant startAt, Instant endAt, AppointmentStatus status,
        String notes, boolean autoAdjusted) {
}