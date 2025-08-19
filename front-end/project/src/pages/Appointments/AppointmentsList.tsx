// src/pages/Appointments/AppointmentsList.tsx
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Eye, Edit, Trash2, Search } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { DataTable } from '../../components/ui/DataTable'
import { Button } from '../../components/ui/Button'
import { Badge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { useAppointment, useCancelAppointment } from '../../hooks/useAppointments'
import { formatDateTime, statusLabels, specialtyLabels } from '../../lib/date'
import { Appointment } from '../../types/domain'

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SCHEDULED': return 'info'
    case 'RESCHEDULED': return 'warning'
    case 'CANCELLED': return 'error'
    case 'COMPLETED': return 'success'
    default: return 'default'
  }
}

export const AppointmentsList: React.FC = () => {
  const [searchId, setSearchId] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)

  const { data: appointment, isFetching } = useAppointment(selectedId, !!selectedId)
  const cancelMutation = useCancelAppointment()

  const [cancelDialog, setCancelDialog] = useState<{ open: boolean; appointment?: Appointment }>({ open: false })

  const handleCancel = async () => {
    if (cancelDialog.appointment) {
      await cancelMutation.mutateAsync(cancelDialog.appointment.id)
      setCancelDialog({ open: false })
    }
  }

  const columns = [
    {
      header: 'Fecha y Hora',
      accessor: (a: Appointment) => formatDateTime(a.startAt)
    },
    {
      header: 'Paciente',
      accessor: (a: Appointment) =>
        // si no tienes nombres embebidos, muestra solo IDs
        (a as any).patient?.firstName
          ? `${(a as any).patient.firstName} ${(a as any).patient.lastName}`
          : a.patientId
    },
    {
      header: 'Médico',
      accessor: (a: Appointment) =>
        (a as any).doctor?.firstName
          ? `Dr. ${(a as any).doctor.firstName} ${(a as any).doctor.lastName}`
          : a.doctorId
    },
    {
      header: 'Especialidad',
      accessor: (a: Appointment) => specialtyLabels[a.specialty] || a.specialty
    },
    {
      header: 'Estado',
      accessor: (a: Appointment) => (
        <Badge variant={getStatusVariant(a.status)}>
          {statusLabels[a.status] || a.status}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (a: Appointment) => (
        <div className="flex items-center space-x-2">
          <Link to={`/appointments/${a.id}`}>
            <Button variant="ghost" size="sm"><Eye size={16} /></Button>
          </Link>
          {a.status === 'SCHEDULED' && (
            <>
              <Link to={`/appointments/${a.id}/reschedule`}>
                <Button variant="ghost" size="sm"><Edit size={16} /></Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancelDialog({ open: true, appointment: a })}
              >
                <Trash2 size={16} className="text-red-600" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ]

  const data = appointment ? [appointment] : []

  return (
    <PageContainer
      title="Citas Médicas"
      subtitle="Consulta una cita por su identificador"
      actions={
        <Link to="/appointments/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Nueva Cita
          </Button>
        </Link>
      }
    >
      {/* Buscador por ID */}
      <div className="bg-white rounded-lg shadow p-4 mb-4 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">ID de la cita</label>
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="c560de04-7df0-41f6-acc2-5522636a6652"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <Button onClick={() => setSelectedId(searchId)} disabled={!searchId}>
          <Search size={16} className="mr-2" />
          Buscar
        </Button>
      </div>

      <DataTable
        data={data}
        columns={columns}
        loading={isFetching}
        currentPage={0}
        totalPages={1}
        onPageChange={() => {}}
        emptyMessage="Ingresa un ID para buscar la cita"
      />

      <ConfirmDialog
        isOpen={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false })}
        onConfirm={handleCancel}
        title="Cancelar Cita"
        message="¿Estás seguro de que deseas cancelar esta cita médica?"
        confirmText="Cancelar Cita"
        variant="danger"
        loading={cancelMutation.isPending}
      />
    </PageContainer>
  )
}
