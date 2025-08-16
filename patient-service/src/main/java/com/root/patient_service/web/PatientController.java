package com.root.patient_service.web;

import com.root.patient_service.service.*;
import com.root.patient_service.web.dto.PatientRequest;
import com.root.patient_service.web.dto.PatientResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {
private final PatientAppService app;


@PostMapping
public ResponseEntity<PatientResponse> create(@RequestBody @Valid PatientRequest req){
PatientResponse res = app.create(req);
return ResponseEntity.created(URI.create("/api/v1/patients/"+res.id())).body(res);
}


@GetMapping("/{id}")
public PatientResponse get(@PathVariable UUID id){ return app.get(id); }


@GetMapping
public Page<PatientResponse> list(@RequestParam(defaultValue = "0") int page,
@RequestParam(defaultValue = "10") int size){
return app.list(page, size);
}


@PutMapping("/{id}")
public PatientResponse update(@PathVariable UUID id, @RequestBody @Valid PatientRequest req){
return app.update(id, req);
}


@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable UUID id){ app.delete(id); }
}