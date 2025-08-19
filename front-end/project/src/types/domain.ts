export type UUID = string;

export interface Patient {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

export type Specialty =
  | 'MEDICINA_GENERAL'
  | 'PEDIATRIA'
  | 'GINECOLOGIA'
  | 'CARDIOLOGIA'
  | 'DERMATOLOGIA'
  | 'ODONTOLOGIA'
  | 'TRAUMATOLOGIA';

export interface Doctor {
  id: UUID;
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialty: Specialty;
  phone: string;
  createdAt?: string;
  updatedAt?: string;
}

export type AppointmentStatus = 'SCHEDULED' | 'RESCHEDULED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: UUID;
  patientId: UUID;
  doctorId: UUID;
  patient?: Patient;
  doctor?: Doctor;
  specialty: Specialty;
  startAt: string; // ISO
  endAt: string;   // ISO
  status: AppointmentStatus;
  notes?: string;
  autoAdjusted?: boolean;
}

export interface Page<T> {
  content: T[];
  pageable: { pageNumber: number; pageSize: number };
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface AvailabilitySlot {
  start: string; // ISO
  end: string;   // ISO
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
  phone: string;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  licenseNumber: string;
  specialty: Specialty;
  phone: string;
}

export interface CreateAppointmentByDateRequest {
  patientId: UUID;
  doctorId: UUID;
  specialty: Specialty;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  notes?: string;
}

export interface RescheduleAppointmentRequest {
  startAt: string; // ISO
  durationMinutes: number;
  notes?: string;
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  upcomingAppointments: Appointment[];
}