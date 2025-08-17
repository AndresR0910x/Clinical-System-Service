package com.root.patient_service.service;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import java.util.*;

@Component
@RequiredArgsConstructor
public class PatientEventPublisher {
private final RabbitTemplate rabbitTemplate;
private final TopicExchange patientExchange;


@Value("${app.amqp.routing.created}") private String rkCreated;
@Value("${app.amqp.routing.updated}") private String rkUpdated;
@Value("${app.amqp.routing.deleted}") private String rkDeleted;


public void publishCreated(Object payload){ send(rkCreated, payload); }
public void publishUpdated(Object payload){ send(rkUpdated, payload); }
public void publishDeleted(Object payload){ send(rkDeleted, payload); }


private void send(String routingKey, Object payload){
Map<String, Object> event = Map.of(
"type", routingKey,
"occurredAt", new Date(),
"payload", payload
);
rabbitTemplate.convertAndSend(patientExchange.getName(), routingKey, event);
}
}