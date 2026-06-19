import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { 
    LayoutDashboard, Users, Syringe, Calendar, 
    Bell, Search, LogOut, Menu, ShieldAlert 
} from 'lucide-react';

export const DashboardLayout = () => {
    const { user, logout } = useAuthStore();
    const location = useLocation();

    // Menú de navegación adaptable a VacunApp
    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/patients', icon: Users, label: 'Pacientes' },
        { path: '/vaccines', icon: Syringe, label: 'Vacunas' },
        { path: '/campaigns', icon: Calendar, label: 'Campañas' },
        { path: '/outbreaks', icon: ShieldAlert, label: 'Alertas Sanitarias' },
        { path: '/users', icon: Users, label: 'Usuarios'},
    ];

    return (
        <div className="min-h-screen bg-slate-100 flex">
            
            {/* SIDEBAR (Barra Lateral) */}
            <aside className="w-64 bg-white shadow-xl hidden md:flex flex-col z-20">
                {/* Perfil del Usuario */}
                <div className="p-6 border-b border-slate-100 flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-2xl mb-3 shadow-inner">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg truncate w-full text-center">
                        {user?.email?.split('@')[0]}
                    </h3>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
                        {user?.role === 'admin' ? 'Administrador' : 'Ciudadano'}
                    </p>
                </div>

                {/* Navegación */}
                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <li key={item.path}>
                                    <Link 
                                        to={item.path}
                                        className={`flex items-center gap-4 px-6 py-3 font-medium transition-colors border-l-4 ${
                                            isActive 
                                            ? 'border-primary text-primary bg-blue-50' 
                                            : 'border-transparent text-slate-500 hover:text-primary hover:bg-slate-50'
                                        }`}
                                    >
                                        <Icon size={20} />
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Botón Salir */}
                <div className="p-4 border-t border-slate-100">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
                    >
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* CONTENIDO PRINCIPAL */}
            <div className="flex-1 flex flex-col min-w-0">
                
                {/* TOPBAR (Barra Superior Azul) */}
                <header className="bg-primary text-white h-16 flex items-center justify-between px-6 shadow-md z-10">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden p-2 hover:bg-blue-800 rounded-lg">
                            <Menu size={24} />
                        </button>
                        <h2 className="text-xl font-bold tracking-wide">VacunApp MX</h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hover:text-blue-200 transition-colors">
                            <Search size={20} />
                        </button>
                        <button className="relative hover:text-blue-200 transition-colors">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-primary"></span>
                        </button>
                    </div>
                </header>

                {/* ÁREA DINÁMICA DE LAS PÁGINAS */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet /> {/* Aquí se inyectará el Dashboard, Pacientes, etc. */}
                </main>
            </div>
        </div>
    );
};