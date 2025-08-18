package com.root.appointment_service.repo;

import com.root.appointment_service.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.time.Instant;
import java.util.*;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

  @Query("""
         select (count(a)>0) from Appointment a
         where a.doctorId=:doctorId and a.status in :active
           and a.startAt < :end and a.endAt > :start
         """)
  boolean doctorHasOverlap(@Param("doctorId") UUID doctorId,
                           @Param("start") Instant start,
                           @Param("end") Instant end,
                           @Param("active") Collection<AppointmentStatus> active);

  @Query("""
         select (count(a)>0) from Appointment a
         where a.patientId=:patientId and a.status in :active
           and a.startAt < :end and a.endAt > :start
         """)
  boolean patientHasOverlap(@Param("patientId") UUID patientId,
                            @Param("start") Instant start,
                            @Param("end") Instant end,
                            @Param("active") Collection<AppointmentStatus> active);

  // 🔽 NUEVO: lista del día por doctor (para construir slots)
  List<Appointment> findByDoctorIdAndStartAtBetweenOrderByStartAt(UUID doctorId, Instant dayStart, Instant dayEnd);
}