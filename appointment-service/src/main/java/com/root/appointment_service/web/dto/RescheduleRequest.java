package com.root.appointment_service.web.dto;

import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.UUID;

public record RescheduleRequest(
        Instant startAt,
        @Min(10) @Max(180) Integer durationMinutes,
        UUID doctorId,
        String notes) {
}