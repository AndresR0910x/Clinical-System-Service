import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Dashboard } from '../pages/Dashboard/Dashboard';
import { PatientsList } from '../pages/Patients/PatientsList';
import { PatientForm } from '../pages/Patients/PatientForm';
import { PatientDetail } from '../pages/Patients/PatientDetail';
import { DoctorsList } from '../pages/Doctors/DoctorsList';
import { DoctorForm } from '../pages/Doctors/DoctorForm';
import { DoctorDetail } from '../pages/Doctors/DoctorDetail';
import { AppointmentsList } from '../pages/Appointments/AppointmentsList';
import { AppointmentWizard } from '../pages/Appointments/AppointmentWizard';
import { Settings } from '../pages/Settings/Settings';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Patients Routes */}
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id" element={<PatientDetail />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />
          
          {/* Doctors Routes */}
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/doctors/new" element={<DoctorForm />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/doctors/:id/edit" element={<DoctorForm />} />
          
          {/* Appointments Routes */}
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/new" element={<AppointmentWizard />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};