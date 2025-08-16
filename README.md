Sistema Clínico
🏥 Descripción General
Sistema basado en una arquitectura de microservicios para gestionar turnos médicos, utilizando comunicación REST y eventos AMQP, con persistencia en PostgreSQL (Neon) y orquestación mediante Docker. El flujo principal incluye: agendar 📅, modificar 🔄, anular ❌ y consultar 🔎 turnos, junto con notificaciones por email ✉️.
🧩 Componentes

🩺 patient-service (8081)Gestiona el CRUD de pacientes. Emite eventos patient.created, patient.updated y patient.deleted.

🧑‍⚕️ doctor-service (8080)Administra el CRUD de médicos y especialidades. Emite eventos doctor.created, doctor.updated y doctor.deleted.

📅 appointment-service (8083)Maneja las reglas de agenda:  

Evita solapamientos de turnos para pacientes y médicos.  
Configuración de slots (ej., 30 minutos).  
Asignación por especialidad (permite elegir médico si no se especifica doctorId).  
Publica eventos appointment.created, appointment.rescheduled y appointment.cancelled.


✉️ notification-service (8084)Suscrito a eventos appointment.*, envía correos al paciente (mock en desarrollo, SMTP en producción).

🐇 RabbitMQBus de eventos con topic exchanges: clinic.patients, clinic.doctors, clinic.appointments.

🐘 PostgreSQL (Neon)Persistencia independiente para cada servicio.


🔗 Interacciones Clave

REST: appointment-service consulta a patient-service y doctor-service para validar existencia, email y especialidad.  
Eventos (AMQP):  
Creación, reprogramación o cancelación de turnos → publicación en clinic.appointments con appointment.*.  
notification-service consume estos eventos y genera correos, formateando fechas a la zona horaria America/Guayaquil.



🧠 Reglas de Negocio Destacadas

Disponibilidad: No se permite solapamiento de turnos (paciente o médico).  
Autoajuste: Si un horario está ocupado, se propone el siguiente slot libre y se marca como autoAdjusted.  
Estados: SCHEDULED, RESCHEDULED, CANCELLED, COMPLETED.  
Especialidades soportadas: MEDICINA_GENERAL, PEDIATRIA, GINECOLOGIA, CARDIOLOGIA, DERMATOLOGIA, ODONTOLOGIA (extensible).

🛠️ Tecnologías

Java 17 · Spring Boot 3 (Web, Validation, Data JPA, AMQP, Mail)  
PostgreSQL (Neon) · Hibernate JPA  
RabbitMQ (event-driven)  
Maven  
Docker & Docker Compose 🐳  
GitHub Actions 🚀 (CI para construir y publicar imágenes a GHCR)

🚦 Operación & Calidad

Errores manejados con ProblemDetail (HTTP semántico).  
DTOs limpios para entrada/salida.  
Timestamps en formato ISO-8601, convertidos a hora local para emails.  
Tests con listener de notificaciones desactivable en entorno de prueba.  
Escalabilidad mediante servicios independientes, acoplados por eventos, listos para réplicas detrás de un balanceador.

📈 Extensiones Futuras

Recordatorios automáticos (SMS/Email) ⏰  
Calendarios por médico y bloqueo de horarios 🗓️  
Auditoría y trazabilidad de eventos 🧾  
Métricas/observabilidad con Prometheus/Grafana 📊  
Autenticación/Autorización (API Gateway + OAuth2) 🔐

En conjunto, el sistema ofrece una agenda médica robusta y extensible con bajo acoplamiento, alta cohesión y mensajería confiable para notificaciones en tiempo real.