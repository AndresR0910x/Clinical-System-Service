package com.root.appointment_service.web;

import com.root.appointment_service.service.AppointmentAppService;
import com.root.appointment_service.web.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentAppService app;

    // Crear con Instant (flujo existente)
    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@RequestBody @Valid CreateAppointmentRequest req) {
        var res = app.create(req);
        return ResponseEntity.created(URI.create("/api/v1/appointments/" + res.id())).body(res);
    }

    // NUEVO: Crear indicando fecha + hora (sin solapes)
    @PostMapping("/by-date")
    public ResponseEntity<AppointmentResponse> createByDate(@RequestBody @Valid CreateAppointmentByDateRequest req) {
        var res = app.createByDate(req);
        return ResponseEntity.created(URI.create("/api/v1/appointments/" + res.id())).body(res);
    }

    // Obtener por id
    @GetMapping("/{id}")
    public AppointmentResponse get(@PathVariable UUID id) {
        return app.get(id);
    }

    // Reprogramar
    @PutMapping("/{id}/reschedule")
    public AppointmentResponse reschedule(@PathVariable UUID id, @RequestBody @Valid RescheduleRequest req) {
        return app.reschedule(id, req);
    }

    // Cancelar
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable UUID id) {
        app.cancel(id);
    }

    // NUEVO: Disponibilidad diaria por doctor (para elegir hora sin solapes)
    @GetMapping("/availability")
    public AvailableSlotsResponse availability(@RequestParam UUID doctorId,
                                               @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                               @RequestParam(required = false, defaultValue = "30") Integer slotMinutes,
                                               @RequestParam(required = false, defaultValue = "08:00") String workStart,
                                               @RequestParam(required = false, defaultValue = "17:00") String workEnd,
                                               @RequestParam(required = false) Integer durationMinutes) {
        return app.getAvailability(doctorId, date, slotMinutes, workStart, workEnd, durationMinutes);
    }

    
}
