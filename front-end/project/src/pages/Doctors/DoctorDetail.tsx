import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Edit, ArrowLeft, Calendar } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useDoctor } from '../../hooks/useDoctors';
import { specialtyLabels } from '../../lib/date';

export const DoctorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: doctor, isLoading, error } = useDoctor(id!);

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </PageContainer>
    );
  }

  if (error || !doctor) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <p className="text-gray-600">No se pudo cargar la información del médico</p>
          <Button className="mt-4" onClick={() => navigate('/doctors')}>
            Volver a la lista
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Dr. ${doctor.firstName} ${doctor.lastName}`}
      subtitle="Información detallada del médico"
      actions={
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={() => navigate('/doctors')}>
            <ArrowLeft size={16} className="mr-2" />
            Volver
          </Button>
          <Link to={`/doctors/${doctor.id}/edit`}>
            <Button>
              <Edit size={16} className="mr-2" />
              Editar
            </Button>
          </Link>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="text-lg font-medium text-gray-900">Información Profesional</h3>
            </div>
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Nombre Completo</dt>
                  <dd className="mt-1 text-sm text-gray-900">Dr. {doctor.firstName} {doctor.lastName}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Especialidad</dt>
                  <dd className="mt-1 text-sm text-gray-900">{specialtyLabels[doctor.specialty]}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Número de Licencia</dt>
                  <dd className="mt-1 text-sm text-gray-900">{doctor.licenseNumber}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{doctor.email}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Teléfono</dt>
                  <dd className="mt-1 text-sm text-gray-900">{doctor.phone}</dd>
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
              <Link to={`/appointments/new?doctorId=${doctor.id}`} className="block">
                <Button className="w-full" variant="primary">
                  <Calendar size={16} className="mr-2" />
                  Nueva Cita
                </Button>
              </Link>
              <Link to={`/doctors/${doctor.id}/edit`} className="block">
                <Button className="w-full" variant="secondary">
                  <Edit size={16} className="mr-2" />
                  Editar Información
                </Button>
              </Link>
            </div>
          </div>

          {/* Doctor Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Citas Hoy</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Citas Esta Semana</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Próximas Citas</span>
                <span className="text-sm font-medium text-gray-900">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};