# Sistema Clínico Frontend

Una aplicación frontend completa para la gestión de un sistema clínico, construida con React, TypeScript, y las mejores prácticas modernas.

## 🚀 Tecnologías Utilizadas

- **React 18** con TypeScript
- **Vite** como bundler y servidor de desarrollo
- **React Router** para navegación
- **TanStack Query** para manejo de estado y fetching
- **Axios** para peticiones HTTP
- **Tailwind CSS** para estilos
- **React Hook Form + Zod** para formularios y validaciones
- **Day.js** para manejo de fechas y zonas horarias
- **React Hot Toast** para notificaciones

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y llamadas a API
│   ├── axios.ts           # Configuración de Axios
│   ├── patients.ts        # API de pacientes
│   ├── doctors.ts         # API de médicos
│   └── appointments.ts    # API de citas
├── hooks/                 # React Query hooks
│   ├── usePatients.ts     # Hooks para pacientes
│   ├── useDoctors.ts      # Hooks para médicos
│   └── useAppointments.ts # Hooks para citas
├── components/
│   ├── ui/                # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── DataTable.tsx
│   │   └── ...
│   └── layout/            # Componentes de layout
│       ├── Navbar.tsx
│       ├── Sidebar.tsx
│       └── Layout.tsx
├── pages/                 # Páginas de la aplicación
│   ├── Dashboard/
│   ├── Patients/
│   ├── Doctors/
│   ├── Appointments/
│   └── Settings/
├── types/                 # Definiciones de tipos TypeScript
│   └── domain.ts
├── lib/                   # Utilidades
│   └── date.ts           # Helpers para fechas
├── routes/
│   └── AppRouter.tsx     # Configuración de rutas
└── main.tsx              # Punto de entrada
```

## 🛠️ Instalación y Configuración

### Prerequisitos

- Node.js 18+ 
- npm o yarn

### Pasos de Instalación

1. **Clona el repositorio**
   ```bash
   git clone [repository-url]
   cd clinical-system-frontend
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_BASE_URL=http://localhost:7070
   ```

4. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:5173`

## 🏥 Funcionalidades Principales

### Dashboard
- KPIs del sistema (pacientes, médicos, citas)
- Lista de próximas citas
- Accesos rápidos a funcionalidades principales

### Gestión de Pacientes
- ✅ Listado con búsqueda y paginación
- ✅ Crear nuevo paciente
- ✅ Ver detalles del paciente
- ✅ Editar información del paciente
- ✅ Eliminar paciente

### Gestión de Médicos
- ✅ Listado con filtro por especialidad
- ✅ Crear nuevo médico
- ✅ Ver detalles del médico
- ✅ Editar información del médico
- ✅ Eliminar médico

### Gestión de Citas
- ✅ Listado de citas con estados
- ✅ Wizard para crear nueva cita
- ✅ Consulta de disponibilidad en tiempo real
- ✅ Reprogramar citas existentes
- ✅ Cancelar citas

## 🌐 API Integration

La aplicación se conecta a una API REST a través de `VITE_API_BASE_URL`. Los endpoints soportados incluyen:

### Pacientes
- `POST /patients` - Crear paciente
- `GET /patients` - Listar pacientes (con paginación y búsqueda)
- `GET /patients/{id}` - Obtener paciente
- `PUT /patients/{id}` - Actualizar paciente
- `DELETE /patients/{id}` - Eliminar paciente

### Médicos
- `POST /doctors` - Crear médico
- `GET /doctors` - Listar médicos (con filtro por especialidad)
- `GET /doctors/{id}` - Obtener médico
- `PUT /doctors/{id}` - Actualizar médico
- `DELETE /doctors/{id}` - Eliminar médico

### Citas
- `GET /appointments/availability` - Consultar disponibilidad
- `POST /appointments/by-date` - Crear cita por fecha/hora
- `GET /appointments/{id}` - Obtener cita
- `PUT /appointments/{id}/reschedule` - Reprogramar cita
- `DELETE /appointments/{id}` - Cancelar cita

## 🌍 Configuración Regional

- **Zona Horaria**: America/Guayaquil
- **Idioma**: Español
- **Formato de Fechas**: DD/MM/YYYY
- **Formato de Hora**: HH:mm (24 horas)

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Mobile** (< 768px)
- 📱 **Tablet** (768px - 1024px)
- 💻 **Desktop** (> 1024px)

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo

# Producción
npm run build        # Construye la aplicación para producción
npm run preview      # Previsualiza la build de producción

# Linting
npm run lint         # Ejecuta ESLint
```

## 📋 Validaciones de Formularios

Todas las formas incluyen validaciones robustas usando Zod:

- **Pacientes**: Nombre, apellido, email, cédula (10 dígitos), teléfono, fecha de nacimiento
- **Médicos**: Nombre, apellido, email, número de licencia, especialidad, teléfono
- **Citas**: Paciente, especialidad, médico, fecha (no pasada), hora (disponible)

## 🎨 Sistema de Diseño

### Colores
- **Primario**: Azul (#2563eb) - Navegación y acciones principales
- **Éxito**: Verde (#16a34a) - Estados positivos y confirmaciones
- **Advertencia**: Amarillo (#eab308) - Alertas y cambios
- **Error**: Rojo (#dc2626) - Errores y eliminaciones
- **Neutral**: Grises para textos y fondos

### Componentes UI
- Buttons con variantes (primary, secondary, danger, ghost)
- Inputs con validación visual
- Selects con búsqueda
- Modales y diálogos de confirmación
- DataTables con paginación
- Badges para estados
- Toasts para notificaciones

## 🔧 Configuración Adicional

### ESLint y TypeScript
El proyecto incluye configuración estricta de ESLint y TypeScript para mantener la calidad del código.

### React Query
Configurado para:
- Cache inteligente de datos
- Invalidación automática
- Retry logic
- Estados de loading/error

## 📈 Próximas Mejoras

- [ ] Vista de calendario para citas
- [ ] Reportes y estadísticas avanzadas  
- [ ] Sistema de notificaciones push
- [ ] Integración con sistema de pagos
- [ ] Historial médico de pacientes
- [ ] Recordatorios automáticos de citas

---

**Desarrollado con ❤️ para mejorar la gestión clínica**