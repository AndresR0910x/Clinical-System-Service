import { api } from './axios';
import { Patient, Page, CreatePatientRequest } from '../types/domain';

export const patientsApi = {
  getPatients: async (page = 0, size = 10, search = ''): Promise<Page<Patient>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await api.get(`/patients?${params}`);
    return response.data;
  },

  getPatient: async (id: string): Promise<Patient> => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  createPatient: async (data: CreatePatientRequest): Promise<Patient> => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  updatePatient: async (id: string, data: Partial<CreatePatientRequest>): Promise<Patient> => {
    const response = await api.put(`/patients/${id}`, data);
    return response.data;
  },

  deletePatient: async (id: string): Promise<void> => {
    await api.delete(`/patients/${id}`);
  },

  searchPatients: async (query: string): Promise<Patient[]> => {
    const response = await api.get(`/patients?search=${encodeURIComponent(query)}&size=50`);
    return response.data.content || [];
  },
};