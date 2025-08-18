package com.root.appointment_service.web.dto;

import java.util.UUID;
import java.time.LocalDate;
import java.util.*;

public record AvailableSlotsResponse(
  UUID doctorId,
  LocalDate date,
  int slotMinutes,
  String workStart,   // e.g. "08:00"
  String workEnd,     // e.g. "17:00"
  List<AvailabilitySlot> reserved,
  List<AvailabilitySlot> available
) {}