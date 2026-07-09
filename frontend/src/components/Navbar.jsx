import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="bg-primary text-white w-full shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src={logo} alt="Logo VacunApp" className="h-10 w-auto drop-shadow-md" />
            <span className="text-2xl font-bold tracking-wide">
              VacunApp <span className="font-light text-blue-300">MX</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 font-medium">
            <Link to="/" className="hover:text-blue-300 transition-colors">Inicio</Link>
            <Link to="/vaccines-panel" className="hover:text-blue-300 transition-colors">Vacunas</Link>
            <Link to="/calendar" className="hover:text-blue-300 transition-colors">Calendario</Link>
            <Link to="/centers" className="hover:text-blue-300 transition-colors">Centros</Link>
          </div>

          {/* Mobile Menu Icon */}
          <button
            type="button"
            onClick={toggleMenu}
            className="md:hidden text-blue-100 hover:text-white"
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-3 flex flex-col gap-2 border-t border-blue-400/30 pt-3">
            <Link to="/" className="hover:text-blue-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Inicio
            </Link>
            <Link to="/vaccines" className="hover:text-blue-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Vacunas
            </Link>
            <Link to="/calendar" className="hover:text-blue-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Calendario
            </Link>
            <Link to="/centers" className="hover:text-blue-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Centros
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};