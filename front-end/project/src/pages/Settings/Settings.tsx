import React from 'react';
import { PageContainer } from '../../components/layout/PageContainer';

export const Settings: React.FC = () => {
  return (
    <PageContainer
      title="Configuración"
      subtitle="Ajustes del sistema clínico"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Horarios de Trabajo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hora de Inicio</span>
              <span className="text-sm font-medium text-gray-900">08:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hora de Fin</span>
              <span className="text-sm font-medium text-gray-900">17:00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duración de Slot</span>
              <span className="text-sm font-medium text-gray-900">30 minutos</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Zona Horaria</span>
              <span className="text-sm font-medium text-gray-900">America/Guayaquil</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Idioma</span>
              <span className="text-sm font-medium text-gray-900">Español</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Base URL</span>
              <span className="text-sm font-medium text-gray-900">http://localhost:7070</span>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};