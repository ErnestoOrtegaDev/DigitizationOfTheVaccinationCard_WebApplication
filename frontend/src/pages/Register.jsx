import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2'; 
import logo from '../assets/logo.png';
import axios from '../api/axios.js';
import { Button } from '../components/Button'; 

export const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Verifica tus datos',
        text: 'Las contraseñas no coinciden.',
        confirmButtonColor: '#2563eb' 
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        role: 'citizen' 
      });

      Swal.fire({
        icon: 'success',
        title: '¡Registro Exitoso!',
        text: 'Tu cuenta ha sido creada correctamente.',
        timer: 2500,
        showConfirmButton: false
      });

      navigate('/login');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el registro',
        text: err.response?.data?.message || 'Hubo un problema al crear tu cuenta.',
        confirmButtonColor: '#1e3a8a' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-900 to-blue-700 px-4 py-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 bg-white opacity-30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-[20%] right-[10%] w-48 h-48 bg-white opacity-20 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-blue-100 p-10 relative z-10">
        
        <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-colors">
          <ArrowLeft size={24} />
        </Link>

        <div className="text-center mb-8 mt-4">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-50 p-3 rounded-full text-secondary">
               <img src={logo} alt="Logo VacunApp" className="h-10 w-auto drop-shadow-md" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-primary mb-1">Crea tu perfil</h2>
          <p className="text-sm text-slate-500">Únete a VacunApp MX</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none transition-all"
                placeholder="tu@correo.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="secondary" isLoading={loading}>
              Registrarme
            </Button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-slate-600">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};