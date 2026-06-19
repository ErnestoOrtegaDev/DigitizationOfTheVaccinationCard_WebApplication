import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';

import Swal from 'sweetalert2';
import logo from '../assets/logo.png';
import axios from '../api/axios.js';

export const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            login(response.data.user);

            Swal.fire({
                icon: 'success',
                title: '¡Bienvenido!',
                text: 'Inicio de sesión exitoso',
                timer: 2000,
                showConfirmButton: false
            });

            navigate('/dashboard');
        } catch (err) {
            // LÓGICA MEJORADA DE ERRORES
            let errorTitle = 'Error de acceso';
            let errorMessage = 'Ocurrió un error inesperado. Intenta más tarde.';

            if (!err.response) {
                // El servidor está apagado o no hay internet
                errorTitle = 'Sin conexión';
                errorMessage = 'No pudimos conectar con el servidor. Intentalo mas tarde';
            } else if (err.response.status === 401) {
                // El servidor respondió explícitamente que los datos están mal
                errorMessage = 'Usuario y/o contraseña incorrectos.';
            } else {
                // Cualquier otro error del backend (ej. 500)
                errorMessage = err.response.data?.message || errorMessage;
            }

            Swal.fire({
                icon: 'error',
                title: errorTitle,
                text: errorMessage,
                confirmButtonColor: '#1e3a8a'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-8 relative">
                <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                <div className="text-center mb-8 mt-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-50 p-3 rounded-full text-secondary">
                            <img src={logo} alt="Logo VacunApp" className="h-10 w-auto drop-shadow-md" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-1">Bienvenido de nuevo</h2>
                    <p className="text-sm text-slate-500">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                                placeholder="juan@ejemplo.com"
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button type="submit" variant="primary" isLoading={loading}>
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="text-center mt-6 text-sm text-slate-600">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="text-secondary font-bold hover:underline">
                        Regístrate aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};