package com.root.patient_service.web.dto;

import java.util.*;

import com.root.patient_service.domain.PatientStatus;

import java.time.*;

public record PatientResponse(
        UUID id,
        String firstName,
        String lastName,
        String email,
        String dni,
        String phone,
        PatientStatus status,
        LocalDate birthDate,
        Instant createdAt,
        Instant updatedAt) {
}