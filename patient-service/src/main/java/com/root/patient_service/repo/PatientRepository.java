package com.root.patient_service.repo;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.root.patient_service.domain.Patient;

public interface PatientRepository extends JpaRepository<Patient, UUID> {
    Optional<Patient> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByDni(String dni);
}
