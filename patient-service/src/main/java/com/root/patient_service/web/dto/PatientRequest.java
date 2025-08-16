package com.root.patient_service.web.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record PatientRequest(
        @NotBlank String firstName,
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String dni,
        LocalDate birthDate,
        String phone) {
}
