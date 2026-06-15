import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import logo from '../assets/logo.png';
import axios from '../api/axios.js';

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Limpia el error cuando el usuario escribe
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Petición POST al endpoint de login
            const response = await axios.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            console.log('Login exitoso:', response.data);
            // Las cookies ya están guardadas en el navegador en este punto.
            // Redireccionamos a la futura pantalla principal del sistema
            navigate('/dashboard'); 
        } catch (err) {
            // Capturamos el error enviado por el backend
            setError(err.response?.data?.message || 'Usuario y/o Contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-blue-100 p-8 relative">

                {/* Botón de regreso */}
                <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-primary transition-colors">
                    <ArrowLeft size={24} />
                </Link>

                {/* Header del Formulario */}
                <div className="text-center mb-8 mt-4">
                    <div className="flex justify-center mb-4">
                        <div className="bg-blue-50 p-3 rounded-full text-secondary">
                            <img src={logo} alt="Logo VacunApp" className="h-10 w-auto drop-shadow-md" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-primary mb-1">Bienvenido de nuevo</h2>
                    <p className="text-sm text-slate-500">Ingresa tus credenciales para continuar</p>
                </div>

                {/* Alerta de Error */}
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center font-medium">
                        {error}
                    </div>
                )}

                {/* Formulario */}
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
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
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-secondary focus:border-transparent transition-all outline-none"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full text-white py-3 px-6 rounded-xl font-bold transition-all shadow-md mt-4 
                            ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-blue-800 hover:shadow-lg'}`}
                    >
                        {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Footer del Formulario */}
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