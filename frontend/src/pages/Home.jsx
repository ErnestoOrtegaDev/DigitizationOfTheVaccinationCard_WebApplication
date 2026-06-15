import { Navbar } from '../components/Navbar';
import { UserPlus, LogIn, Syringe, Info, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        // Añadimos un fondo con degradado sutil para que no sea solo blanco/gris
        <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-blue-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex flex-col">

                {/* Título de Bienvenida - Más grande y con subtítulo */}
                <div className="text-center mt-4 mb-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3 drop-shadow-sm">
                        ¡Bienvenido a VacunApp MX!
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Tu portal digital para el control, seguimiento y aplicación de vacunas de forma rápida y segura.
                    </p>
                </div>

                {/* Sección Superior: Banner y Login */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

                    {/* Banner Carrusel (Ahora con efecto zoom al pasar el ratón) */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg overflow-hidden border border-blue-100 flex flex-col transition hover:shadow-xl">
                        <div className="h-72 relative group overflow-hidden bg-slate-200">

                            {/* Imagen corregida */}
                            <img
                                src="/images/clinica_durango_1.jpeg"
                                alt="Campaña de Vacunación"
                                className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                                onError={(e) => e.target.src = "https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=1000&auto=format&fit=crop"}
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>

                            <div className="absolute bottom-6 left-6 text-white">
                                <span className="bg-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block shadow-sm">
                                    Campaña Actual
                                </span>
                                <h2 className="text-3xl font-bold drop-shadow-md">Nuevas sedes en Durango</h2>
                            </div>
                        </div>

                        <div className="p-5 bg-white flex justify-between items-center shrink-0">
                            <span className="text-slate-600 font-medium">Conoce las unidades de atención habilitadas en tu ciudad.</span>
                            <button className="text-secondary font-bold hover:text-primary transition-colors flex items-center gap-1">
                                Ver detalles <span className="text-xl">→</span>
                            </button>
                        </div>
                    </div>

                    {/* Tarjetas de Acceso */}
                    <div className="flex flex-col gap-6 justify-center">

                        {/* Iniciar Sesión Tradicional */}
                        <div className="bg-white p-8 rounded-3xl shadow-lg border border-blue-100 flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-xl">
                            <div className="bg-blue-50 p-4 rounded-full mb-4 text-secondary">
                                <LogIn size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Ya tengo cuenta</h3>
                            <p className="text-sm text-slate-500 mb-6">Accede a tu cartilla digital y gestiona tus citas.</p>
                            <Link to="/login" className="w-full bg-primary hover:bg-blue-800 text-white py-3 px-6 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center">
                                Iniciar Sesión
                            </Link>
                        </div>

                        {/* Crear Perfil (Diseño invertido para resaltar) */}
                        <div className="bg-linear-to-br from-secondary to-blue-600 p-8 rounded-3xl shadow-lg flex flex-col items-center text-center transition hover:-translate-y-1 hover:shadow-xl text-white">
                            <div className="bg-white/20 p-4 rounded-full mb-4">
                                <UserPlus size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Nuevo Registro</h3>
                            <p className="text-sm text-blue-100 mb-6">Regístrate para llevar el control de todas tus vacunas.</p>
                            <Link to="/register" className="w-full bg-white text-secondary hover:bg-blue-50 py-3 px-6 rounded-xl font-bold transition-all shadow-md flex items-center justify-center">
                                Crear Perfil
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Sección Inferior: Noticias / Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    {/* Card 1 */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex items-start gap-4 hover:shadow-lg transition-shadow group">
                        <div className="p-3 bg-blue-50 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Syringe size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">Nuevas Vacunas</h4>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Dosis de refuerzo disponibles para adultos mayores.</p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex items-start gap-4 hover:shadow-lg transition-shadow group">
                        <div className="p-3 bg-blue-50 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                            <Info size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">Aviso Oficial</h4>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Mensaje del Secretario de Salud estatal sobre esquemas.</p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-6 flex items-start gap-4 hover:shadow-lg transition-shadow group">
                        <div className="p-3 bg-blue-50 text-secondary rounded-xl group-hover:bg-secondary group-hover:text-white transition-colors">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-lg">Unidad Médica</h4>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">Módulo de atención habilitado en la zona centro.</p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};