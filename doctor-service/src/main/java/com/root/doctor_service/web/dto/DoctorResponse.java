package com.root.doctor_service.web.dto;

import java.time.Instant;
import java.util.UUID;

import com.root.doctor_service.domain.Specialty;

public record DoctorResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String licenseNumber,
        Specialty specialty,
        String phone,
        Instant createdAt,
        Instant updatedAt) {
}