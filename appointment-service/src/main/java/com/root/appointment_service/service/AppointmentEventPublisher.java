package com.root.appointment_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
@RequiredArgsConstructor
public class AppointmentEventPublisher {
    private final RabbitTemplate rabbit;
    private final TopicExchange exchange;
    @Value("${app.amqp.routing.created}")
    private String rkCreated;
    @Value("${app.amqp.routing.rescheduled}")
    private String rkRescheduled;
    @Value("${app.amqp.routing.cancelled}")
    private String rkCancelled;

    public void created(Object payload) {
        send(rkCreated, payload);
    }

    public void rescheduled(Object payload) {
        send(rkRescheduled, payload);
    }

    public void cancelled(Object payload) {
        send(rkCancelled, payload);
    }

    private void send(String rk, Object payload) {
        Map<String, Object> event = Map.of("type", rk, "occurredAt", new Date(), "payload", payload);
        rabbit.convertAndSend(exchange.getName(), rk, event);
    }
}