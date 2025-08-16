package com.root.doctor_service.service;

import com.root.doctor_service.domain.*;
import com.root.doctor_service.repo.*;
import com.root.doctor_service.web.dto.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorAppService {
    private final DoctorRepository repo;
    private final DoctorEventPublisher events;

    public DoctorResponse create(@Valid DoctorRequest req) {
        if (repo.existsByEmail(req.email()))
            throw new IllegalArgumentException("Email ya registrado");
        if (repo.existsByLicenseNumber(req.licenseNumber()))
            throw new IllegalArgumentException("Licencia ya registrada");
        Doctor d = Doctor.builder()
                .firstName(req.firstName())
                .lastName(req.lastName())
                .email(req.email())
                .licenseNumber(req.licenseNumber())
                .specialty(req.specialty())
                .phone(req.phone())
                .build();
        d = repo.save(d);
        DoctorResponse res = toResponse(d);
        events.publishCreated(res);
        return res;
    }

    @Transactional(readOnly = true)
    public DoctorResponse get(UUID id) {
        Doctor d = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Médico no encontrado"));
        return toResponse(d);
    }

    @Transactional(readOnly = true)
    public Page<DoctorResponse> list(int page, int size) {
        return repo.findAll(PageRequest.of(page, size, Sort.by("lastName").ascending()))
                .map(this::toResponse);
    }

    public DoctorResponse update(UUID id, @Valid DoctorRequest req) {
        Doctor d = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Médico no encontrado"));
        d.setFirstName(req.firstName());
        d.setLastName(req.lastName());
        d.setPhone(req.phone());
        d.setSpecialty(req.specialty());
        if (!d.getEmail().equals(req.email())) {
            if (repo.existsByEmail(req.email()))
                throw new IllegalArgumentException("Email ya registrado");
            d.setEmail(req.email());
        }
        if (!d.getLicenseNumber().equals(req.licenseNumber())) {
            if (repo.existsByLicenseNumber(req.licenseNumber()))
                throw new IllegalArgumentException("Licencia ya registrada");
            d.setLicenseNumber(req.licenseNumber());
        }
        DoctorResponse res = toResponse(d);
        events.publishUpdated(res);
        return res;
    }

    public void delete(UUID id) {
        if (!repo.existsById(id))
            return;
        repo.deleteById(id);
        events.publishDeleted("{\"id\":\"" + id + "\"}");
    }

    private DoctorResponse toResponse(Doctor d) {
        return new DoctorResponse(d.getId(), d.getFirstName(), d.getLastName(), d.getEmail(),
                d.getLicenseNumber(), d.getSpecialty(), d.getPhone(), d.getCreatedAt(), d.getUpdatedAt());
    }
}