import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '../api/patients';
import { CreatePatientRequest } from '../types/domain';
import toast from 'react-hot-toast';

export const usePatients = (page = 0, size = 10, search = '') => {
  return useQuery({
    queryKey: ['patients', page, size, search],
    queryFn: () => patientsApi.getPatients(page, size, search),
  });
};

export const usePatient = (id: string) => {
  return useQuery({
    queryKey: ['patients', id],
    queryFn: () => patientsApi.getPatient(id),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePatientRequest) => patientsApi.createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente creado exitosamente');
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePatientRequest> }) => 
      patientsApi.updatePatient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      queryClient.invalidateQueries({ queryKey: ['patients', variables.id] });
      toast.success('Paciente actualizado exitosamente');
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => patientsApi.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] });
      toast.success('Paciente eliminado exitosamente');
    },
  });
};

export const useSearchPatients = (query: string) => {
  return useQuery({
    queryKey: ['patients', 'search', query],
    queryFn: () => patientsApi.searchPatients(query),
    enabled: query.length >= 2,
  });
};