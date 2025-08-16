package com.root.notification_service.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.time.*;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mail;
    @Value("${app.notify.from}")
    String from;
    @Value("${app.notify.mock:true}")
    boolean mock;

    public void sendAppointmentMail(String to, String subject, String body) {
        if (mock) {
            System.out.println("[MOCK EMAIL] to=" + to + " | " + subject + "\n" + body);
            return;
        }
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(from);
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(body);
        mail.send(msg);
    }
}