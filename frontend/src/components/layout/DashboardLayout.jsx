import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  LayoutDashboard,
  Users,
  Syringe,
  Calendar,
  Bell,
  Search,
  LogOut,
  Menu,
  ShieldAlert,
  Building,
  X,
} from "lucide-react";
import Swal from "sweetalert2";

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const normalizedRole = (user?.role || "citizen").toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isNurse = normalizedRole === "nurse";
  const isCitizen = normalizedRole === "citizen";
  const isPatient = normalizedRole === "citizen" || normalizedRole === "patient";

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/patients", icon: Users, label: "Pacientes" },
    ...(isAdmin || isNurse
      ? [{ path: "/vaccines", icon: Syringe, label: "Vacunas" }]
      : []),
    ...(isAdmin || isNurse || isCitizen
      ? [{ path: "/campaigns", icon: Calendar, label: "Campañas" }]
      : []),
    ...(isAdmin || isNurse || isCitizen
      ? [{ path: "/outbreaks", icon: ShieldAlert, label: "Alertas Sanitarias" }]
      : []),
    ...(isAdmin ? [{ path: "/users", icon: Users, label: "Usuarios" }] : []),
    ...(isAdmin || isNurse || isCitizen
      ? [{ path: "/health-centers", icon: Building, label: "Centros de Salud" }]
      : []),
  ];

  const handleLogoutClick = () => {
    setIsMobileMenuOpen(false);
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "¿Estas seguro que quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
      background: "#ffffff",
      customClass: {
        popup: "rounded-2xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {/* OVERLAY FONDO OSCURO PARA MÓVIL */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Barra Lateral) - Ahora con clases dinámicas para móvil */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Botón cerrar para móvil */}
        <button
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={20} />
        </button>

        {/* Perfil del Usuario */}
        <div className="p-6 border-b border-slate-100 flex flex-col items-center mt-6 md:mt-0">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-2xl mb-3 shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3 className="font-bold text-slate-800 text-lg truncate w-full text-center">
            {user?.email?.split("@")[0]}
          </h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
            {isAdmin
              ? "Administrador"
              : isNurse
                ? "Enfermera"
                : "Paciente"}
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)} // Cierra el menú al navegar
                    className={`flex items-center gap-4 px-6 py-3 font-medium transition-colors border-l-4 ${
                      isActive
                        ? "border-primary text-primary bg-blue-50"
                        : "border-transparent text-slate-500 hover:text-primary hover:bg-slate-50"
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
            onClick={handleLogoutClick}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* TOPBAR (Barra Superior Azul) */}
        <header className="bg-primary text-white h-16 shrink-0 flex items-center justify-between px-6 shadow-md z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
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
          <Outlet />
        </main>
      </div>
    </div>
  );
};
