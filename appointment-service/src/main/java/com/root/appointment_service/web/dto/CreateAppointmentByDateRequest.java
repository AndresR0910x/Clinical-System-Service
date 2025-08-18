package com.root.appointment_service.web.dto;

import com.root.appointment_service.domain.Specialty;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public record CreateAppointmentByDateRequest(
  @NotNull UUID patientId,
  UUID doctorId,             // opcional si selecciona por especialidad
  @NotNull Specialty specialty,
  @NotNull LocalDate date,   // yyyy-MM-dd
  @NotNull LocalTime time,   // HH:mm
  @Min(10) @Max(180) int durationMinutes,
  String notes,
  String zone               // opcional; por defecto "America/Guayaquil"
) {}