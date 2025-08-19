import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { usePatient, useCreatePatient, useUpdatePatient } from '../../hooks/usePatients';
import { CreatePatientRequest } from '../../types/domain';

const patientSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  dni: z.string().min(10, 'La cédula debe tener 10 dígitos').max(10, 'La cédula debe tener 10 dígitos'),
  birthDate: z.string().min(1, 'La fecha de nacimiento es requerida'),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
});

type PatientFormData = z.infer<typeof patientSchema>;

export const PatientForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: patient, isLoading: loadingPatient } = usePatient(id || '');
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
  });

  React.useEffect(() => {
    if (patient && isEditing) {
      reset({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        dni: patient.dni,
        birthDate: patient.birthDate,
        phone: patient.phone,
      });
    }
  }, [patient, isEditing, reset]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/patients');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const isLoading = loadingPatient || createMutation.isPending || updateMutation.isPending;

  return (
    <PageContainer
      title={isEditing ? 'Editar Paciente' : 'Nuevo Paciente'}
      subtitle={isEditing ? 'Actualiza la información del paciente' : 'Registra un nuevo paciente en el sistema'}
    >
      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre"
                {...register('firstName')}
                error={errors.firstName?.message}
                disabled={isLoading}
              />

              <Input
                label="Apellido"
                {...register('lastName')}
                error={errors.lastName?.message}
                disabled={isLoading}
              />

              <Input
                label="Cédula"
                {...register('dni')}
                error={errors.dni?.message}
                disabled={isLoading}
              />

              <Input
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                disabled={isLoading}
              />

              <Input
                label="Teléfono"
                {...register('phone')}
                error={errors.phone?.message}
                disabled={isLoading}
              />

              <Input
                label="Fecha de Nacimiento"
                type="date"
                {...register('birthDate')}
                error={errors.birthDate?.message}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/patients')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Paciente
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};