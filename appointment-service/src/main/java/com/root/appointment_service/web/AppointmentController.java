package com.root.appointment_service.web;

import com.root.appointment_service.service.*;
import com.root.appointment_service.web.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {
    private final AppointmentAppService app;

    @PostMapping
    public ResponseEntity<AppointmentResponse> create(@RequestBody @Valid CreateAppointmentRequest req) {
        var res = app.create(req);
        return ResponseEntity.created(URI.create("/api/v1/appointments/" + res.id())).body(res);
    }

    @GetMapping("/{id}")
    public AppointmentResponse get(@PathVariable UUID id) {
        return app.get(id);
    }

    @PutMapping("/{id}/reschedule")
    public AppointmentResponse reschedule(@PathVariable UUID id, @RequestBody @Valid RescheduleRequest req) {
        return app.reschedule(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable UUID id) {
        app.cancel(id);
    }
}