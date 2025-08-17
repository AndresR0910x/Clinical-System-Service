package com.root.doctor_service.config;

import org.springframework.amqp.core.ExchangeBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitConfig {

    @Value("${app.amqp.exchange}")
    private String doctorExchangeName;

    @Bean
    public Jackson2JsonMessageConverter jackson2JsonMessageConverter() {
        // Serializa/deserializa mensajes a JSON automáticamente
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                         Jackson2JsonMessageConverter messageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter);
        // Establece el exchange por defecto para convertAndSend(...)
        template.setExchange(doctorExchangeName);
        return template;
    }

    @Bean
    public TopicExchange doctorExchange() {
        // Exchange donde publicará el microservicio de doctores
        return ExchangeBuilder
                .topicExchange(doctorExchangeName)
                .durable(true)
                .build();
    }
}
