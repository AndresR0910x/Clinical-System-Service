package com.root.notification_service.service;



import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import java.util.*;

@Component
public class PatientClient {

  private final RestClient rest;

  public PatientClient(@Qualifier("patientRestClient") RestClient rest) {
    this.rest = rest;
  }

  @SuppressWarnings("unchecked")
  public Map<String,Object> get(UUID id){
    return rest.get().uri("/{id}", id).retrieve().body(Map.class);
  }
}