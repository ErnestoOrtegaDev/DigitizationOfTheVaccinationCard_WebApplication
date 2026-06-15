import { Menu } from 'lucide-react';
import logo from '../assets/logo.png'; 
import { Link } from 'react-router-dom'

export const Navbar = () => {
  return (
    <nav className="bg-primary text-white w-full shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={logo} alt="Logo VacunApp" className="h-10 w-auto drop-shadow-md" />
          <span className="text-2xl font-bold tracking-wide">
            VacunApp <span className="font-light text-blue-300">MX</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 font-medium">
          <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
          <Link to="/vaccines" className="hover:text-blue-300 transition-colors">Vacunas</Link>
          <Link to="/calendar" className="hover:text-blue-300 transition-colors">Calendario</Link>
          <Link to="/centers" className="hover:text-blue-300 transition-colors">Centros</Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="md:hidden text-blue-100 hover:text-white">
          <Menu size={28} />
        </button>
      </div>
    </nav>
  );
};