import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doctorsApi } from '../api/doctors';
import { CreateDoctorRequest, Specialty } from '../types/domain';
import toast from 'react-hot-toast';

export const useDoctors = (page = 0, size = 10, specialty?: Specialty) => {
  return useQuery({
    queryKey: ['doctors', page, size, specialty],
    queryFn: () => doctorsApi.getDoctors(page, size, specialty),
  });
};

export const useDoctor = (id: string) => {
  return useQuery({
    queryKey: ['doctors', id],
    queryFn: () => doctorsApi.getDoctor(id),
    enabled: !!id,
  });
};

export const useCreateDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateDoctorRequest) => doctorsApi.createDoctor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Médico creado exitosamente');
    },
  });
};

export const useUpdateDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateDoctorRequest> }) => 
      doctorsApi.updateDoctor(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      queryClient.invalidateQueries({ queryKey: ['doctors', variables.id] });
      toast.success('Médico actualizado exitosamente');
    },
  });
};

export const useDeleteDoctor = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => doctorsApi.deleteDoctor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] });
      toast.success('Médico eliminado exitosamente');
    },
  });
};

export const useDoctorsBySpecialty = (specialty: Specialty) => {
  return useQuery({
    queryKey: ['doctors', 'specialty', specialty],
    queryFn: () => doctorsApi.getDoctorsBySpecialty(specialty),
    enabled: !!specialty,
  });
};