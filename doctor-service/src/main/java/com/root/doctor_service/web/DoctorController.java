package com.root.doctor_service.web;

import com.root.doctor_service.service.*;
import com.root.doctor_service.web.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@RequiredArgsConstructor
public class DoctorController {
private final DoctorAppService app;


@PostMapping
public ResponseEntity<DoctorResponse> create(@RequestBody @Valid DoctorRequest req){
var res = app.create(req);
return ResponseEntity.created(URI.create("/api/v1/doctors/"+res.id())).body(res);
}


@GetMapping("/{id}")
public DoctorResponse get(@PathVariable UUID id){ return app.get(id); }


@GetMapping
public Page<DoctorResponse> list(@RequestParam(defaultValue = "0") int page,
@RequestParam(defaultValue = "10") int size){
return app.list(page, size);
}


@PutMapping("/{id}")
public DoctorResponse update(@PathVariable UUID id, @RequestBody @Valid DoctorRequest req){
return app.update(id, req);
}


@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void delete(@PathVariable UUID id){ app.delete(id); }
}