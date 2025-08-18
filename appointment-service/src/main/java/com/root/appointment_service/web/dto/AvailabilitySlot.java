package com.root.appointment_service.web.dto;

import java.time.Instant;

public record AvailabilitySlot(Instant startAt, Instant endAt) {}