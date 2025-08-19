import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PageContainer } from '../../components/layout/PageContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useSearchPatients } from '../../hooks/usePatients';
import { useDoctorsBySpecialty } from '../../hooks/useDoctors';
import { useAvailability, useCreateAppointment } from '../../hooks/useAppointments';
import { specialtyLabels, getTodayDate, formatTime, toISO } from '../../lib/date';
import { Specialty, CreateAppointmentByDateRequest } from '../../types/domain';

const appointmentSchema = z.object({
  patientId: z.string().min(1, 'Debe seleccionar un paciente'),
  specialty: z.enum([
    'MEDICINA_GENERAL',
    'PEDIATRIA',
    'GINECOLOGIA',
    'CARDIOLOGIA',
    'DERMATOLOGIA',
    'ODONTOLOGIA',
    'TRAUMATOLOGIA'
  ] as const, { required_error: 'La especialidad es requerida' }),
  doctorId: z.string().min(1, 'Debe seleccionar un médico'),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export const AppointmentWizard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState('');

  const createMutation = useCreateAppointment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientId: searchParams.get('patientId') || '',
      doctorId: searchParams.get('doctorId') || '',
      date: getTodayDate(),
    }
  });

  const watchedFields = watch();
  const { data: patients } = useSearchPatients(patientSearch);
  const { data: doctors } = useDoctorsBySpecialty(watchedFields.specialty);
  const { data: availability } = useAvailability(
    watchedFields.doctorId, 
    watchedFields.date,
    !!watchedFields.doctorId && !!watchedFields.date
  );

  const specialtyOptions = Object.entries(specialtyLabels).map(([value, label]) => ({
    value,
    label
  }));

  const patientOptions = (patients || []).map(patient => ({
    value: patient.id,
    label: `${patient.firstName} ${patient.lastName} - ${patient.dni}`
  }));

  const doctorOptions = (doctors || []).map(doctor => ({
    value: doctor.id,
    label: `Dr. ${doctor.firstName} ${doctor.lastName}`
  }));

  const availabilityOptions = (availability || []).map(slot => ({
    value: formatTime(slot.start),
    label: `${formatTime(slot.start)} - ${formatTime(slot.end)}`
  }));

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      const appointmentData: CreateAppointmentByDateRequest = {
        patientId: data.patientId,
        doctorId: data.doctorId,
        specialty: data.specialty,
        date: data.date,
        time: data.time,
        durationMinutes: 30,
        notes: data.notes
      };

      await createMutation.mutateAsync(appointmentData);
      navigate('/appointments');
    } catch (error) {
      // Error handled by mutation
    }
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return watchedFields.patientId;
      case 2:
        return watchedFields.specialty && watchedFields.doctorId;
      case 3:
        return watchedFields.date;
      case 4:
        return watchedFields.time;
      default:
        return false;
    }
  };

  const steps = [
    { number: 1, title: 'Seleccionar Paciente' },
    { number: 2, title: 'Elegir Especialidad y Médico' },
    { number: 3, title: 'Seleccionar Fecha' },
    { number: 4, title: 'Confirmar Hora' }
  ];

  return (
    <PageContainer
      title="Nueva Cita Médica"
      subtitle="Sigue los pasos para programar una nueva cita"
    >
      <div className="max-w-4xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                  ${step.number <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                  }
                `}>
                  {step.number}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 mx-4 h-0.5 ${
                    step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Step 1: Select Patient */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Seleccionar Paciente</h3>
                
                <Input
                  label="Buscar Paciente"
                  placeholder="Buscar por nombre, email o DNI..."
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                />
                
                <Select
                  label="Paciente"
                  options={patientOptions}
                  value={watchedFields.patientId}
                  onChange={(value) => setValue('patientId', value)}
                  error={errors.patientId?.message}
                />
              </div>
            )}

            {/* Step 2: Select Specialty and Doctor */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Especialidad y Médico</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Select
                    label="Especialidad"
                    options={specialtyOptions}
                    value={watchedFields.specialty || ''}
                    onChange={(value) => {
                      setValue('specialty', value as Specialty);
                      setValue('doctorId', ''); // Reset doctor when specialty changes
                    }}
                    error={errors.specialty?.message}
                  />

                  <Select
                    label="Médico"
                    options={doctorOptions}
                    value={watchedFields.doctorId}
                    onChange={(value) => setValue('doctorId', value)}
                    error={errors.doctorId?.message}
                    disabled={!watchedFields.specialty}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Select Date */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Seleccionar Fecha</h3>
                
                <Input
                  label="Fecha de la Cita"
                  type="date"
                  min={getTodayDate()}
                  {...register('date')}
                  error={errors.date?.message}
                />
              </div>
            )}

            {/* Step 4: Select Time */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Confirmar Hora</h3>
                
                {availability && availability.length > 0 ? (
                  <div className="space-y-4">
                    <Select
                      label="Horario Disponible"
                      options={availabilityOptions}
                      value={watchedFields.time || ''}
                      onChange={(value) => setValue('time', value)}
                      error={errors.time?.message}
                    />

                    <div className="border rounded-lg p-4 bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Resumen de la Cita</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Paciente: {patientOptions.find(p => p.value === watchedFields.patientId)?.label}</p>
                        <p>Médico: {doctorOptions.find(d => d.value === watchedFields.doctorId)?.label}</p>
                        <p>Especialidad: {specialtyLabels[watchedFields.specialty]}</p>
                        <p>Fecha: {watchedFields.date}</p>
                        <p>Hora: {watchedFields.time}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notas (opcional)
                      </label>
                      <textarea
                        {...register('notes')}
                        rows={3}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Notas adicionales sobre la cita..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No hay horarios disponibles para la fecha seleccionada
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft size={16} className="mr-2" />
              Anterior
            </Button>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/appointments')}
              >
                Cancelar
              </Button>
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                >
                  Siguiente
                  <ChevronRight size={16} className="ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  loading={createMutation.isPending}
                  disabled={!canProceed() || !availability?.length}
                >
                  Crear Cita
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};