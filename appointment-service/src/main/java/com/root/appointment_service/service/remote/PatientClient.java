package com.root.appointment_service.service.remote;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import lombok.RequiredArgsConstructor;
import java.util.*;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestClientResponseException;

@Component
public class PatientClient {

  private final RestClient rest;

  // Constructor explícito con Qualifier (NO usar @RequiredArgsConstructor aquí)
  public PatientClient(@Qualifier("patientRestClient") RestClient rest) {
    this.rest = rest;
  }

  public Map<String, Object> getPatient(UUID id) {
    return rest.get().uri("/{id}", id).retrieve().body(Map.class);
  }
}