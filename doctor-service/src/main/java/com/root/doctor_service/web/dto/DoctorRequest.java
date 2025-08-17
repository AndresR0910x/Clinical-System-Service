package com.root.doctor_service.web.dto;

import com.root.doctor_service.domain.Specialty;

import jakarta.validation.constraints.*;

public record DoctorRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String licenseNumber,
        Specialty specialty,
        String phone) {
}