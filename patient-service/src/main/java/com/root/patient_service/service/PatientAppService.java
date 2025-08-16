package com.root.patient_service.service;

import com.root.patient_service.domain.*;
import com.root.patient_service.repo.*;
import com.root.patient_service.web.dto.PatientRequest;
import com.root.patient_service.web.dto.PatientResponse;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientAppService {
    private final PatientRepository repo;
    private final PatientEventPublisher events;

    public PatientResponse create(@Valid PatientRequest req) {
        if (repo.existsByEmail(req.email()))
            throw new IllegalArgumentException("Email ya registrado");
        if (repo.existsByDni(req.dni()))
            throw new IllegalArgumentException("DNI ya registrado");
        Patient p = Patient.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .dni(req.dni())
                .birthDate(req.birthDate())
                .phone(req.phone())
                .status(PatientStatus.ACTIVE)
                .build();
        p = repo.save(p);
        PatientResponse res = toResponse(p);
        events.publishCreated(res);
        return res;
    }

    @Transactional(readOnly = true)
    public PatientResponse get(UUID id) {
        Patient p = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));
        return toResponse(p);
    }

    @Transactional(readOnly = true)
    public Page<PatientResponse> list(int page, int size) {
        return repo.findAll(PageRequest.of(page, size, Sort.by("lastName").ascending()))
                .map(this::toResponse);
    }

    public PatientResponse update(UUID id, @Valid PatientRequest req) {
        Patient p = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));
        p.setFirstName(req.firstName());
        p.setLastName(req.lastName());
        p.setBirthDate(req.birthDate());
        p.setPhone(req.phone());
        if (!p.getEmail().equals(req.email())) {
            if (repo.existsByEmail(req.email()))
                throw new IllegalArgumentException("Email ya registrado");
            p.setEmail(req.email());
        }
        if (!p.getDni().equals(req.dni())) {
            if (repo.existsByDni(req.dni()))
                throw new IllegalArgumentException("DNI ya registrado");
            p.setDni(req.dni());
        }
        PatientResponse res = toResponse(p);
        events.publishUpdated(res);
        return res;
    }

    public void delete(UUID id) {
        if (!repo.existsById(id))
            return;
        repo.deleteById(id);
        events.publishDeleted("{\"id\":\"" + id + "\"}");
    }

    private PatientResponse toResponse(Patient p) {
        return new PatientResponse(p.getId(), p.getFirstName(), p.getLastName(), p.getEmail(),
                p.getDni(), p.getPhone(), p.getStatus(), p.getBirthDate(), p.getCreatedAt(), p.getUpdatedAt());
    }
}