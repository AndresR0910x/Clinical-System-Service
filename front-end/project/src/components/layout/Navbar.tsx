import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-3 lg:hidden"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="text-blue-600" size={28} />
              <span className="text-xl font-bold text-gray-900">ClinicPro</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Sistema de Gestión Clínica
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};