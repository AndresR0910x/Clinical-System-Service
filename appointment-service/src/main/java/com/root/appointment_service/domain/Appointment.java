package com.root.appointment_service.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "appointments", indexes = { @Index(name = "idx_doctor_start", columnList = "doctorId,startAt"),
        @Index(name = "idx_patient_start", columnList = "patientId,startAt") })
public class Appointment {
    @Id
    @GeneratedValue
    private UUID id;
    @Column(nullable = false)
    private UUID patientId;
    @Column(nullable = false)
    private UUID doctorId;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private Specialty specialty;
    @Column(nullable = false)
    private Instant startAt;
    @Column(nullable = false)
    private Instant endAt;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status;
    @Column(length = 240)
    private String notes;
    @Column(nullable = false)
    private Instant createdAt;
    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        var now = Instant.now();
        createdAt = now;
        updatedAt = now;
        if (status == null)
            status = AppointmentStatus.SCHEDULED;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}