import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { DataTable } from '../../components/ui/DataTable';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { useDoctors, useDeleteDoctor } from '../../hooks/useDoctors';
import { specialtyLabels } from '../../lib/date';
import { Doctor, Specialty } from '../../types/domain';

export const DoctorsList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; doctor?: Doctor }>({
    open: false
  });

  const { data: doctorsPage, isLoading } = useDoctors(currentPage, 10, selectedSpecialty);
  const deleteMutation = useDeleteDoctor();

  const handleDelete = async () => {
    if (deleteDialog.doctor) {
      await deleteMutation.mutateAsync(deleteDialog.doctor.id);
      setDeleteDialog({ open: false });
    }
  };

  const specialtyOptions = Object.entries(specialtyLabels).map(([value, label]) => ({
    value,
    label
  }));

  const columns = [
    {
      header: 'Nombre',
      accessor: (doctor: Doctor) => `Dr. ${doctor.firstName} ${doctor.lastName}`
    },
    {
      header: 'Licencia',
      accessor: 'licenseNumber' as keyof Doctor
    },
    {
      header: 'Especialidad',
      accessor: (doctor: Doctor) => specialtyLabels[doctor.specialty] || doctor.specialty
    },
    {
      header: 'Email',
      accessor: 'email' as keyof Doctor
    },
    {
      header: 'Teléfono',
      accessor: 'phone' as keyof Doctor
    },
    {
      header: 'Acciones',
      accessor: (doctor: Doctor) => (
        <div className="flex items-center space-x-2">
          <Link to={`/doctors/${doctor.id}`}>
            <Button variant="ghost" size="sm">
              <Eye size={16} />
            </Button>
          </Link>
          <Link to={`/doctors/${doctor.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit size={16} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteDialog({ open: true, doctor })}
          >
            <Trash2 size={16} className="text-red-600" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageContainer
      title="Médicos"
      subtitle="Gestión de médicos del sistema"
      actions={
        <Link to="/doctors/new">
          <Button>
            <Plus size={20} className="mr-2" />
            Nuevo Médico
          </Button>
        </Link>
      }
    >
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-64">
            <Select
              placeholder="Todas las especialidades"
              options={specialtyOptions}
              value={selectedSpecialty || ''}
              onChange={(value) => setSelectedSpecialty(value as Specialty || undefined)}
            />
          </div>
        </div>
      </div>

      <DataTable
        data={doctorsPage?.content || []}
        columns={columns}
        loading={isLoading}
        currentPage={currentPage}
        totalPages={doctorsPage?.totalPages || 0}
        onPageChange={setCurrentPage}
        emptyMessage="No se encontraron médicos"
      />

      <ConfirmDialog
        isOpen={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false })}
        onConfirm={handleDelete}
        title="Eliminar Médico"
        message={`¿Estás seguro de que deseas eliminar al Dr. ${deleteDialog.doctor?.firstName} ${deleteDialog.doctor?.lastName}?`}
        confirmText="Eliminar"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </PageContainer>
  );
};