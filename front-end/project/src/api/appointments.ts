// src/api/appointmentsApi.ts
import { api } from './axios'
import {
  Appointment,
  AvailabilitySlot,
  CreateAppointmentByDateRequest,
  RescheduleAppointmentRequest,
  UUID
} from '../types/domain'

export const appointmentsApi = {
  // ✅ Availability (se mantiene)
  async getAvailability(
    doctorId: UUID,
    date: string,
    slotMinutes = 30,
    workStart = '08:00',
    workEnd = '17:00',
    durationMinutes = 30
  ): Promise<AvailabilitySlot[]> {
    const params = new URLSearchParams({
      doctorId,
      date,
      slotMinutes: String(slotMinutes),
      workStart,
      workEnd,
      durationMinutes: String(durationMinutes)
    })
    const { data } = await api.get(`/appointments/availability?${params}`)
    return data.available || []
  },

  // ✅ Crear por fecha/hora
  async createAppointmentByDate(data: CreateAppointmentByDateRequest): Promise<Appointment> {
    const res = await api.post('/appointments/by-date', data)
    return res.data
  },

  // ✅ Crear por startAt (auto-ajuste si choca)
  async createAppointmentInstant(appointment: Partial<Appointment>): Promise<Appointment> {
    const res = await api.post('/appointments', appointment)
    return res.data
  },

  // ✅ Obtener por ID (único GET que usaremos para citas)
  async getAppointment(id: UUID): Promise<Appointment> {
    const res = await api.get(`/appointments/${id}`)
    return res.data
  },

  // ❌ Eliminamos endpoints no soportados en el back:
  // getAppointments, getTodayAppointments, getUpcomingAppointments

  // ✅ Reprogramar
  async rescheduleAppointment(id: UUID, data: RescheduleAppointmentRequest): Promise<Appointment> {
    const res = await api.put(`/appointments/${id}/reschedule`, data)
    return res.data
  },

  // ✅ Cancelar
  async cancelAppointment(id: UUID): Promise<void> {
    await api.delete(`/appointments/${id}`)
  }
}
