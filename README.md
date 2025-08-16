🏥 Sistema Clínico — Descripción General

Arquitectura de microservicios para gestionar turnos médicos con comunicación REST + eventos AMQP, persistencia en PostgreSQL (Neon) y orquestación con Docker. El flujo cubre: agendar 📅, modificar 🔄, anular ❌ y consultar 🔎 turnos, más notificaciones por email ✉️.

🧩 Componentes

🩺 patient-service (8081)
CRUD de pacientes. Emite eventos patient.created/updated/deleted.

🧑‍⚕️ doctor-service (8080)
CRUD de médicos y especialidades. Emite doctor.created/updated/deleted.

📅 appointment-service (8083)
Reglas de agenda:

evita solapes para paciente y médico,

slots configurables (p.ej., 30 min),

asignación por especialidad (puede elegir médico si no se envía doctorId),

publica eventos appointment.created/rescheduled/cancelled.

✉️ notification-service (8084)
Suscribe a appointment.* y envía correo al paciente (modo mock para desarrollo o SMTP real).

🐇 RabbitMQ
Bus de eventos (topic exchanges): clinic.patients, clinic.doctors, clinic.appointments.

🐘 PostgreSQL (Neon)
Persistencia independiente por servicio.

🔗 Interacciones clave

REST: appointment-service consulta a patient-service y doctor-service para validar existencia, email y especialidad.

Eventos (AMQP):

Al crear/reprogramar/cancelar un turno → se publica en clinic.appointments con appointment.*.

notification-service consume y construye el correo (formateando fechas a zona America/Guayaquil).

🧠 Reglas de negocio destacadas

Disponibilidad: no se permite solapamiento de turnos (paciente/médico).

Autoajuste: si la hora solicitada está ocupada, se propone el siguiente slot libre y se marca como autoAdjusted.

Estados: SCHEDULED, RESCHEDULED, CANCELLED, COMPLETED.

Especialidades soportadas (ej.): MEDICINA_GENERAL, PEDIATRIA, GINECOLOGIA, CARDIOLOGIA, DERMATOLOGIA, ODONTOLOGIA (extensible).

🛠️ Tecnologías

Java 17 · Spring Boot 3 (Web, Validation, Data JPA, AMQP, Mail)

PostgreSQL (Neon) · Hibernate JPA

RabbitMQ (event-driven)

Maven

Docker & Docker Compose 🐳

GitHub Actions 🚀 (CI para construir y publicar imágenes a GHCR)

🚦 Operación & Calidad

Errores consistentes con ProblemDetail (HTTP semántico).

DTOs limpios para entrada/salida.

Timestamps en ISO-8601 (convertidos a local para emails).

Tests: listener de notificaciones desactivable en entorno de prueba.

Escalabilidad: servicios independientes, acoplados por eventos, preparados para réplicas detrás de un balanceador.

📈 Extensiones futuras (ideas)

Recordatorios automáticos (SMS/Email) ⏰

Calendarios por médico y bloqueo de horarios 🗓️

Auditoría y trazabilidad de eventos 🧾

Métricas/observabilidad (Prometheus/Grafana) 📊

Autenticación/Autorización (API Gateway + OAuth2) 🔐

En conjunto, el sistema ofrece una agenda médica robusta y extensible con bajo acoplamiento, alta cohesión y mensajería confiable para notificaciones en tiempo real.