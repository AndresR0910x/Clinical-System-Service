package com.root.doctor_service.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.*;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "doctors", uniqueConstraints = {
        @UniqueConstraint(name = "uk_doctors_email", columnNames = "email"),
        @UniqueConstraint(name = "uk_doctors_license", columnNames = "license_number")
})
public class Doctor {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 80)
    private String firstName;

    @Column(nullable = false, length = 80)
    private String lastName;

    @Email
    @NotBlank
    @Column(nullable = false, length = 120)
    private String email;

    @NotBlank
    @Column(name = "license_number", nullable = false, length = 30)
    private String licenseNumber; // número de MSP, etc.

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private Specialty specialty;

    @Column(length = 20)
    private String phone;

    @Column(nullable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}