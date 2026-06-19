import { useAuthStore } from '../store/authStore';
import { Syringe, Users, Calendar, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Datos estáticos para la gráfica (Proyección a futuro)
const chartData = [
  { name: 'Ene', vacunas: 400 },
  { name: 'Feb', vacunas: 300 },
  { name: 'Mar', vacunas: 550 },
  { name: 'Abr', vacunas: 480 },
  { name: 'May', vacunas: 600 },
  { name: 'Jun', vacunas: 800 },
];

export const Dashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
        
        {/* Header de bienvenida */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Bienvenido, <span className="text-primary">{user?.email?.split('@')[0]}</span>
                </h1>
                <p className="text-slate-500 mt-1">Aquí está el resumen del sistema de vacunación.</p>
            </div>
            <div className="hidden sm:block text-right">
                <p className="text-3xl font-black text-slate-800">1,245</p>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Dosis Aplicadas</p>
            </div>
        </div>

        {/* Tarjetas de Resumen (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tarjeta 1 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Pacientes Registrados</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">8,450</h3>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-xl text-primary">
                        <Users size={24} />
                    </div>
                </div>
                <div className="bg-primary px-5 py-2">
                    <p className="text-white text-xs font-semibold">+12% este mes</p>
                </div>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Campañas Activas</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">3</h3>
                    </div>
                    <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                        <Calendar size={24} />
                    </div>
                </div>
                <div className="bg-orange-600 px-5 py-2">
                    <p className="text-white text-xs font-semibold">Influenza, Covid-19, VPH</p>
                </div>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Vacunas en Stock</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">15,200</h3>
                    </div>
                    <div className="bg-green-50 p-3 rounded-xl text-green-600">
                        <Syringe size={24} />
                    </div>
                </div>
                <div className="bg-green-600 px-5 py-2">
                    <p className="text-white text-xs font-semibold">Abastecimiento Óptimo</p>
                </div>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 font-medium text-sm">Brotes Sanitarios</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">1</h3>
                    </div>
                    <div className="bg-red-50 p-3 rounded-xl text-red-600">
                        <Activity size={24} />
                    </div>
                </div>
                <div className="bg-red-600 px-5 py-2">
                    <p className="text-white text-xs font-semibold">Alerta: Sarampión en Región Sur</p>
                </div>
            </div>
        </div>

        {/* Sección de Analítica */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Analítica de Vacunación (2026)</h3>
            <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="vacunas" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

    </div>
  );
};