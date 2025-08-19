import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Users, UserCheck, Calendar, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/axios'
import { PageContainer } from '../../components/layout/PageContainer'
import { DataTable } from '../../components/ui/DataTable'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { useAppointment } from '../../hooks/useAppointments'
import { formatDateTime, statusLabels, specialtyLabels } from '../../lib/date'
import { Appointment } from '../../types/domain'

const StatCard: React.FC<{
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  link?: string
}> = ({ title, value, icon, color, link }) => {
  const content = (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  )
  return link ? <Link to={link}>{content}</Link> : content
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'info'
    case 'RESCHEDULED':
      return 'warning'
    case 'CANCELLED':
      return 'error'
    case 'COMPLETED':
      return 'success'
    default:
      return 'default'
  }
}

export const Dashboard: React.FC = () => {
  // Totales usando las APIs de pacientes y médicos (no necesitamos endpoints nuevos)
  const { data: patientsTotal = 0 } = useQuery({
    queryKey: ['patients', 'count'],
    queryFn: async () => {
      const { data } = await api.get('/patients?page=0&size=1')
      return data?.totalElements ?? 0
    }
  })

  const { data: doctorsTotal = 0 } = useQuery({
    queryKey: ['doctors', 'count'],
    queryFn: async () => {
      const { data } = await api.get('/doctors?page=0&size=1')
      return data?.totalElements ?? 0
    }
  })

  // Búsqueda de cita por ID (único GET soportado en appointments)
  const [searchId, setSearchId] = useState<string>('')
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const { data: appointment, isFetching } = useAppointment(selectedId, !!selectedId)

  const appointmentColumns = [
    {
      header: 'Fecha y Hora',
      accessor: (a: Appointment) => formatDateTime(a.startAt)
    },
    {
      header: 'Paciente',
      accessor: (a: Appointment) =>
        // si no hay nombres embebidos, mostramos el id del paciente
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
    }
  ]

  const data = appointment ? [appointment] : []

  return (
    <PageContainer title="Dashboard" subtitle="Resumen del sistema clínico">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatCard
          title="Total Pacientes"
          value={patientsTotal}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="border-blue-600"
          link="/patients"
        />
        <StatCard
          title="Total Médicos"
          value={doctorsTotal}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          color="border-green-600"
          link="/doctors"
        />
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/patients/new"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-600"
        >
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Nuevo Paciente</h3>
              <p className="text-sm text-gray-600">Registrar un nuevo paciente</p>
            </div>
          </div>
        </Link>

        <Link
          to="/doctors/new"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-green-600"
        >
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Nuevo Médico</h3>
              <p className="text-sm text-gray-600">Registrar un nuevo médico</p>
            </div>
          </div>
        </Link>

        <Link
          to="/appointments/new"
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-purple-600"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Nueva Cita</h3>
              <p className="text-sm text-gray-600">Programar una nueva cita</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Buscar cita por ID */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Buscar Cita por ID</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-end gap-3">
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
            columns={appointmentColumns}
            loading={isFetching}
            emptyMessage="Ingresa un ID y presiona Buscar"
          />
        </div>
      </div>
    </PageContainer>
  )
}
