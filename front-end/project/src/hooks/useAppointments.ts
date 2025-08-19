// src/hooks/useAppointments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentsApi } from '../api/appointments'
import { UUID, RescheduleAppointmentRequest, CreateAppointmentByDateRequest } from '../types/domain'

export function useAppointment(id?: UUID, enabled = !!id) {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsApi.getAppointment(id as UUID),
    enabled
  })
}

// (por si la usas en el wizard)
export function useAvailability(doctorId?: UUID, date?: string, enabled?: boolean) {
  return useQuery({
    queryKey: ['availability', doctorId, date],
    queryFn: () => appointmentsApi.getAvailability(doctorId as UUID, date as string),
    enabled: !!doctorId && !!date && enabled !== false
  })
}

export function useCreateAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateAppointmentByDateRequest) => appointmentsApi.createAppointmentByDate(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointment'] })
  })
}

export function useRescheduleAppointment(id: UUID) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: RescheduleAppointmentRequest) => appointmentsApi.rescheduleAppointment(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['appointment', id] })
    }
  })
}

export function useCancelAppointment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: UUID) => appointmentsApi.cancelAppointment(id),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['appointment', id] })
    }
  })
}
