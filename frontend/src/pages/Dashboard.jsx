import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Syringe, Users, Calendar, Activity, Loader2, AlertCircle } from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchDashboardData } from '../services/dashboard.service';

// Paleta de colores para cada mes del año
const MONTH_COLORS = [
    '#1e3a8a', // Ene - Azul oscuro (Primary)
    '#0284c7', // Feb - Azul cielo
    '#0d9488', // Mar - Verde azulado (Teal)
    '#16a34a', // Abr - Verde esmeralda
    '#ca8a04', // May - Amarillo dorado
    '#ea580c', // Jun - Naranja vibrante
    '#dc2626', // Jul - Rojo carmesí
    '#9333ea', // Ago - Púrpura
    '#4f46e5', // Sep - Índigo
    '#2563eb', // Oct - Azul rey
    '#059669', // Nov - Verde menta
    '#475569'  // Dic - Pizarra (Slate)
];

export const Dashboard = () => {
    const { user, token } = useAuthStore();

    // Estados de carga y datos dinámicos
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalPatients: 0,
            activeCampaignsCount: 0,
            activeCampaignsNames: 'Cargando...',
            totalStock: 0,
            totalApplied: 0,
            sanitaryAlerts: { count: 0, text: 'Sin alertas sanitarias' }
        },
        chartData: []
    });

    // Cargar datos de la BD MySQL al montar el componente
    useEffect(() => {
        let isMounted = true;

        const getStats = async () => {
            try {
                setLoading(true);
                setError(null);

                // Llamamos al servicio (asegúrate de que API_URL apunte al puerto 4000)
                const res = await fetchDashboardData(token);

                if (isMounted && res.success) {
                    setDashboardData(res.data);
                } else if (isMounted) {
                    setError(res.message || "Error al recibir datos del servidor.");
                }
            } catch (err) {
                console.error("Error cargando dashboard:", err);
                if (isMounted) {
                    setError(err.response?.data?.message || "No se pudo contactar al servidor Node.js en Docker.");
                }
            } finally {
                // ESTO ES CLAVE: Apaga el spinner pase lo que pase
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getStats();

        return () => {
            isMounted = false;
        };
    }, [token]);
    // Función para formatear números con comas (Ej: 15,200)
    const formatNumber = (num) => {
        return new Intl.NumberFormat('es-MX').format(num || 0);
    };

    // Pantalla de Carga (Spinner)
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 space-y-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-slate-500 font-medium animate-pulse">Sincronizando con base de datos sanitaria...</p>
            </div>
        );
    }

    // Pantalla de Error
    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 p-6 rounded-2xl flex items-center space-x-4 text-red-700">
                <AlertCircle className="w-8 h-8 shrink-0 text-red-600" />
                <div>
                    <h4 className="font-bold text-lg">Error de Conexión</h4>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    const { stats, chartData } = dashboardData;

    return (
        <div className="space-y-6">

            {/* Header de bienvenida */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Bienvenido, <span className="text-primary">{user?.email?.split('@')[0] || 'Usuario'}</span>
                    </h1>
                    <p className="text-slate-500 mt-1">Aquí está el resumen dinámico del sistema de vacunación.</p>
                </div>
                <div className="hidden sm:block text-right">
                    <p className="text-3xl font-black text-slate-800">{formatNumber(stats.totalApplied)}</p>
                    <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">Dosis Aplicadas</p>
                </div>
            </div>

            {/* Tarjetas de Resumen (Grid Dinámico) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Tarjeta 1: Pacientes */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Pacientes Registrados</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatNumber(stats.totalPatients)}</h3>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-xl text-primary">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="bg-primary px-5 py-2">
                        <p className="text-white text-xs font-semibold">Padrón en MySQL Cloud</p>
                    </div>
                </div>

                {/* Tarjeta 2: Campañas */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Campañas Activas</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.activeCampaignsCount}</h3>
                        </div>
                        <div className="bg-orange-50 p-3 rounded-xl text-orange-600">
                            <Calendar size={24} />
                        </div>
                    </div>
                    <div className="bg-orange-600 px-5 py-2">
                        <p className="text-white text-xs font-semibold truncate" title={stats.activeCampaignsNames}>
                            {stats.activeCampaignsNames}
                        </p>
                    </div>
                </div>

                {/* Tarjeta 3: Stock */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Vacunas en Stock</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatNumber(stats.totalStock)}</h3>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl text-green-600">
                            <Syringe size={24} />
                        </div>
                    </div>
                    <div className="bg-green-600 px-5 py-2">
                        <p className="text-white text-xs font-semibold">
                            {stats.totalStock > 1000 ? 'Abastecimiento Óptimo' : 'Revisar Inventario'}
                        </p>
                    </div>
                </div>

                {/* Tarjeta 4: Brotes/Alertas */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 flex justify-between items-start">
                        <div>
                            <p className="text-slate-500 font-medium text-sm">Brotes Sanitarios</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{stats.sanitaryAlerts.count}</h3>
                        </div>
                        <div className="bg-red-50 p-3 rounded-xl text-red-600">
                            <Activity size={24} />
                        </div>
                    </div>
                    <div className="bg-red-600 px-5 py-2">
                        <p className="text-white text-xs font-semibold truncate" title={stats.sanitaryAlerts.text}>
                            {stats.sanitaryAlerts.text}
                        </p>
                    </div>
                </div>
            </div>

            {/* Sección de Analítica con Gráfica Multicolores */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Analítica de Vacunación (2026)</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                        En tiempo real
                    </span>
                </div>

                {chartData && chartData.length > 0 ? (
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontWeight: 500 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`${formatNumber(value)} dosis`, 'Aplicadas']}
                                />
                                <Bar dataKey="vacunas" radius={[6, 6, 0, 0]} barSize={42}>
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={MONTH_COLORS[index % MONTH_COLORS.length]}
                                            className="transition-all duration-300 hover:opacity-80"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <div className="h-72 w-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl">
                        <p className="text-slate-400 text-sm font-medium">Aún no hay registros de vacunación para generar la gráfica en este periodo.</p>
                    </div>
                )}
            </div>

        </div>
    );
};