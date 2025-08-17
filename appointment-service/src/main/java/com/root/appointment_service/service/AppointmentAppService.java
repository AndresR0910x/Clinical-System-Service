package com.root.appointment_service.service;

import com.root.appointment_service.domain.*;
import com.root.appointment_service.repo.*;
import com.root.appointment_service.web.dto.*;
import com.root.appointment_service.service.remote.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentAppService {
    private final AppointmentRepository repo;
    private final AvailabilityService availability;
    private final AppointmentEventPublisher events;
    private final PatientClient patients;
    private final DoctorClient doctors;

    public AppointmentResponse create(@Valid CreateAppointmentRequest req) {
        // 1) validar paciente
        var p = patients.getPatient(req.patientId());
        if (p == null)
            throw new IllegalArgumentException("Paciente no existe");
        // 2) elegir/validar médico por especialidad
        UUID doctorId = req.doctorId();
        if (doctorId == null) {
            var list = doctors.findBySpecialty(req.specialty());
            if (list.isEmpty())
                throw new IllegalArgumentException("No hay médicos para la especialidad");
            doctorId = UUID.fromString(String.valueOf(list.get(0).get("id")));
        } else {
            var d = doctors.getDoctor(doctorId);
            if (d == null || !String.valueOf(d.get("specialty")).equals(req.specialty().name()))
                throw new IllegalArgumentException("Médico no coincide con especialidad");
        }

        // 3) disponibilidad y posible ajuste (turno extra)
        Instant start = req.startAt();
        Instant end = start.plus(Duration.ofMinutes(req.durationMinutes()));
        boolean auto = false;
        if (!availability.isFree(doctorId, req.patientId(), start, end)) {
            Instant[] next = availability.nextAvailable(doctorId, req.patientId(), start, req.durationMinutes(), 10);
            start = next[0];
            end = next[1];
            auto = true; // "crear turno extra" simple
        }

        Appointment a = Appointment.builder()
                .patientId(req.patientId()).doctorId(doctorId).specialty(req.specialty())
                .startAt(start).endAt(end).status(auto ? AppointmentStatus.RESCHEDULED : AppointmentStatus.SCHEDULED)
                .notes(req.notes()).build();
        a = repo.save(a);
        AppointmentResponse res = toResponse(a, auto);
        events.created(res);
        return res;
    }

    @Transactional(readOnly = true)
    public AppointmentResponse get(UUID id) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));
        return toResponse(a, false);
    }

    public AppointmentResponse reschedule(UUID id, @Valid RescheduleRequest req) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));
        UUID doctorId = req.doctorId() != null ? req.doctorId() : a.getDoctorId();
        Instant start = req.startAt() != null ? req.startAt() : a.getStartAt();
        int minutes = req.durationMinutes() != null ? req.durationMinutes()
                : (int) Duration.between(a.getStartAt(), a.getEndAt()).toMinutes();
        Instant end = start.plus(Duration.ofMinutes(minutes));
        if (!availability.isFree(doctorId, a.getPatientId(), start, end))
            throw new IllegalArgumentException("Conflicto de horario");
        a.setDoctorId(doctorId);
        a.setStartAt(start);
        a.setEndAt(end);
        a.setStatus(AppointmentStatus.RESCHEDULED);
        a.setNotes(req.notes() != null ? req.notes() : a.getNotes());
        AppointmentResponse res = toResponse(a, false);
        events.rescheduled(res);
        return res;
    }

    public void cancel(UUID id) {
        var a = repo.findById(id).orElseThrow(() -> new EntityNotFoundException("Turno no existe"));
        a.setStatus(AppointmentStatus.CANCELLED);
        events.cancelled(toResponse(a, false));
    }

    private AppointmentResponse toResponse(Appointment a, boolean auto) {
        return new AppointmentResponse(a.getId(), a.getPatientId(), a.getDoctorId(), a.getSpecialty(), a.getStartAt(),
                a.getEndAt(), a.getStatus(), a.getNotes(), auto);
    }
}