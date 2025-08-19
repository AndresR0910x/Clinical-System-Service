import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { usePatients, useDeletePatient } from '../../hooks/usePatients';
import { formatDate } from '../../lib/date';
import { Patient } from '../../types/domain';

export const PatientsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; patient?: Patient }>({
    open: false
  });

  const { data: patientsPage, isLoading } = usePatients(currentPage, 10, search);
  const deleteMutation = useDeletePatient();

  const handleDelete = async () => {
    if (deleteDialog.patient) {
      await deleteMutation.mutateAsync(deleteDialog.patient.id);
      setDeleteDialog({ open: false });
    }
  };

  const columns = [
    {
      header: 'Nombre',
      accessor: (patient: Patient) => `${patient.firstName} ${patient.lastName}`
    },
    {
      header: 'DNI',
      accessor: 'dni' as keyof Patient
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Patient
    },
    {
      header: 'Teléfono',
      accessor: 'phone' as keyof Patient
    },
    {
      header: 'Fecha de Nacimiento',
      accessor: (patient: Patient) => formatDate(patient.birthDate)
    },
    {
      header: 'Estado',
      accessor: (patient: Patient) => (
        <Badge variant={patient.status === 'ACTIVE' ? 'success' : 'error'}>
          {patient.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
        </Badge>
      )
    },
    {
      header: 'Acciones',
      accessor: (patient: Patient) => (
        <div className="flex items-center space-x-2">
          <Link to={`/patients/${patient.id}`}>
            <Button variant="ghost" size="sm">
              <Eye size={16} />
            </Button>
          </Link>
          <Link to={`/patients/${patient.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit size={16} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialog({ open: true, patient })}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Pacientes"
      subtitle="Gestión de pacientes del sistema"
      actions={
        <Link to="/patients/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Nuevo Paciente
          </Button>
        </Link>
      }
    >
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nombre, email o DNI..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <DataTable
        data={patientsPage?.content || []}
        columns={columns}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={patientsPage?.totalPages || 0}
        onPageChange={setCurrentPage}
        emptyMessage="No se encontraron pacientes"
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDelete}
        title="Eliminar Paciente"
        message={`¿Estás seguro de que deseas eliminar al paciente ${deleteDialog.patient?.firstName} ${deleteDialog.patient?.lastName}?`}
        confirmText="Eliminar"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
};