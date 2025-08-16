package com.root.appointment_service.service.remote;

import com.root.appointment_service.domain.*;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.util.*;

@Component
public class DoctorClient {

  private final RestClient rest;

  public DoctorClient(@Qualifier("doctorRestClient") RestClient rest) {
    this.rest = rest;
  }

  @SuppressWarnings("unchecked")
  public Map<String, Object> getDoctor(UUID id) {
    return rest.get().uri("/{id}", id).retrieve().body(Map.class);
  }

  /** Devuelve una lista (mínima) de médicos con la especialidad dada.
   *  Implementación por defecto: trae la primera página y filtra localmente. */
  @SuppressWarnings("unchecked")
  public List<Map<String, Object>> findBySpecialty(Specialty sp) {
    // Si tienes un endpoint /search, descomenta esto:
    // Map page = rest.get()
    //     .uri(uri -> uri.path("/search").queryParam("specialty", sp.name()).build())
    //     .retrieve().body(Map.class);

    Map page = rest.get().retrieve().body(Map.class); // GET /api/v1/doctors (paginado)
    if (page == null) return List.of();

    Object contentObj = page.get("content");
    if (!(contentObj instanceof List<?> content)) return List.of();

    return ((List<Map<String, Object>>) content).stream()
        .filter(d -> sp.name().equals(String.valueOf(d.get("specialty"))))
        .toList();
  }
}