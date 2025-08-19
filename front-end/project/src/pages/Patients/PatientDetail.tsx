import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft, Calendar } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { usePatient } from '../../hooks/usePatients';
import { formatDate } from '../../lib/date';

export const PatientDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: patient, isLoading, error } = usePatient(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !patient) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">No se pudo cargar la información del paciente</p>
          <Button className="mt-4" onClick={() => navigate('/patients')}>
            Volver a la lista
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`${patient.firstName} ${patient.lastName}`}
      subtitle="Información detallada del paciente"
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => navigate('/patients')}>
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
          <Link to={`/patients/${patient.id}/edit`}>
            <Button>
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.firstName} {patient.lastName}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Cédula</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.dni}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                  <dd className="mt-1 text-sm text-gray-900">{patient.phone}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Fecha de Nacimiento</dt>
                  <dd className="mt-1 text-sm text-gray-900">{formatDate(patient.birthDate)}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Estado</dt>
                  <dd className="mt-1">
                    <Badge variant={patient.status === 'ACTIVE' ? 'success' : 'error'}>
                      {patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link to={`/appointments/new?patientId=${patient.id}`} className="block">
                <Button className="w-full" variant="primary">
                  <Calendar size={16} className="mr-2" />
                  Nueva Cita
                </Button>
              </Link>
              <Link to={`/patients/${patient.id}/edit`} className="block">
                <Button className="w-full" variant="secondary">
                  <Edit size={16} className="mr-2" />
                  Editar Información
                </Button>
              </Link>
            </div>
          </div>

          {/* Patient Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Citas Totales</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última Cita</span>
                <span className="text-sm font-medium text-gray-900">N/A</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Próxima Cita</span>
                <span className="text-sm font-medium text-gray-900">N/A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};