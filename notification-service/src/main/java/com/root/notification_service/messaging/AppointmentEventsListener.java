package com.root.notification_service.messaging;

import com.root.notification_service.service.*;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
@ConditionalOnProperty(prefix = "app.notifications", name = "enabled", havingValue = "true", matchIfMissing = true)
public class AppointmentEventsListener {

    private final PatientClient patients;
    private final EmailService email;

    public AppointmentEventsListener(PatientClient patients, EmailService email) {
        this.patients = patients;
        this.email = email;
    }

    @RabbitListener(queues = "${app.amqp.queue}")
    public void onEvent(Map<String, Object> event) {
        Map payload = (Map) event.get("payload");
        if (payload == null)
            return;

        UUID patientId = UUID.fromString(String.valueOf(payload.get("patientId")));
        var p = patients.get(patientId);
        if (p == null)
            return;

        String emailTo = String.valueOf(p.get("email"));
        String type = String.valueOf(event.get("type"));
        String start = String.valueOf(payload.get("startAt"));
        String end = String.valueOf(payload.get("endAt"));
        String specialty = String.valueOf(payload.get("specialty"));

        String subject = switch (type) {
            case "appointment.cancelled" -> "Cita cancelada";
            case "appointment.rescheduled" -> "Cita reprogramada";
            default -> "Cita registrada";
        };

        String body = "Hola " + p.get("firstName") + ",\n\n" +
                switch (type) {
                    case "appointment.cancelled" -> "Tu cita ha sido cancelada.";
                    case "appointment.rescheduled" -> "Tu cita ha sido reprogramada.";
                    default -> "Tu cita ha sido agendada.";
                } +
                "\nEspecialidad: " + specialty +
                "\nInicio: " + start +
                "\nFin: " + end +
                "\n\nGracias por usar nuestro servicio.";

        email.sendAppointmentMail(emailTo, subject, body);
    }
}