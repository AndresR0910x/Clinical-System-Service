package com.root.appointment_service.web.dto;

import com.root.appointment_service.domain.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

public record CreateAppointmentRequest(
        @NotNull UUID patientId,
        UUID doctorId,
        @NotNull Specialty specialty,
        @NotNull Instant startAt,
        @Min(10) @Max(180) int durationMinutes,
        String notes) {
}
