package com.root.notification_service.config;


import org.springframework.context.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;

@Configuration
public class ClientsConfig {
    @Bean(name = "patientRestClient")
    public RestClient patientClient(@Value("${services.patient.base-url}") String base) {
        return RestClient.builder().baseUrl(base).build();
    }
}