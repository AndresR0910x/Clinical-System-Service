import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useDoctor, useCreateDoctor, useUpdateDoctor } from '../../hooks/useDoctors';
import { specialtyLabels } from '../../lib/date';
import { CreateDoctorRequest, Specialty } from '../../types/domain';

const doctorSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  licenseNumber: z.string().min(5, 'El número de licencia es requerido'),
  specialty: z.enum([
    'MEDICINA_GENERAL',
    'PEDIATRIA',
    'GINECOLOGIA',
    'CARDIOLOGIA',
    'DERMATOLOGIA',
    'ODONTOLOGIA',
    'TRAUMATOLOGIA'
  ] as const, { required_error: 'La especialidad es requerida' }),
  phone: z.string().min(9, 'El teléfono debe tener al menos 9 dígitos'),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

export const DoctorForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const { data: doctor, isLoading: loadingDoctor } = useDoctor(id || '');
  const createMutation = useCreateDoctor();
  const updateMutation = useUpdateDoctor();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  React.useEffect(() => {
    if (doctor && isEditing) {
      reset({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        licenseNumber: doctor.licenseNumber,
        specialty: doctor.specialty,
        phone: doctor.phone,
      });
    }
  }, [doctor, isEditing, reset]);

  const onSubmit = async (data: DoctorFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: id!, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      navigate('/doctors');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const specialtyOptions = Object.entries(specialtyLabels).map(([value, label]) => ({
    value,
    label
  }));

  const isLoading = loadingDoctor || createMutation.isPending || updateMutation.isPending;

  return (
    <PageContainer
      title={isEditing ? 'Editar Médico' : 'Nuevo Médico'}
      subtitle={isEditing ? 'Actualiza la información del médico' : 'Registra un nuevo médico en el sistema'}
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
                label="Email"
                type="email"
                {...register('email')}
                error={errors.email?.message}
                disabled={isLoading}
              />

              <Input
                label="Número de Licencia"
                {...register('licenseNumber')}
                error={errors.licenseNumber?.message}
                disabled={isLoading}
              />

              <Select
                label="Especialidad"
                options={specialtyOptions}
                value={doctor?.specialty || ''}
                onChange={(value) => setValue('specialty', value as Specialty)}
                error={errors.specialty?.message}
                disabled={isLoading}
              />

              <Input
                label="Teléfono"
                {...register('phone')}
                error={errors.phone?.message}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/doctors')}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              loading={isLoading}
            >
              {isEditing ? 'Actualizar' : 'Crear'} Médico
            </Button>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};