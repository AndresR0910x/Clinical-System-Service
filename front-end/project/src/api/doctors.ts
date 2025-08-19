import { api } from './axios';
import { Doctor, Page, CreateDoctorRequest, Specialty } from '../types/domain';

export const doctorsApi = {
  getDoctors: async (page = 0, size = 10, specialty?: Specialty): Promise<Page<Doctor>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    
    if (specialty) {
      params.append('specialty', specialty);
    }
    
    const response = await api.get(`/doctors?${params}`);
    return response.data;
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  createDoctor: async (data: CreateDoctorRequest): Promise<Doctor> => {
    const response = await api.post('/doctors', data);
    return response.data;
  },

  updateDoctor: async (id: string, data: Partial<CreateDoctorRequest>): Promise<Doctor> => {
    const response = await api.put(`/doctors/${id}`, data);
    return response.data;
  },

  deleteDoctor: async (id: string): Promise<void> => {
    await api.delete(`/doctors/${id}`);
  },

  getDoctorsBySpecialty: async (specialty: Specialty): Promise<Doctor[]> => {
    const response = await api.get(`/doctors?specialty=${specialty}&size=100`);
    return response.data.content || [];
  },
};