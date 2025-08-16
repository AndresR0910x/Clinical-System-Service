package com.root.doctor_service.repo;

import com.root.doctor_service.domain.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
boolean existsByEmail(String email);
boolean existsByLicenseNumber(String licenseNumber);
}
