import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { fetchGlobalSearch } from "../../services/search.service"; // Importamos el nuevo servicio
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
  User,       
  ArrowRight,
  Loader2     // Agregamos el loader de Lucide
} from "lucide-react";
import Swal from "sweetalert2";

export const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- ESTADOS PARA EL BUSCADOR DINÁMICO ---
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); // Para mostrar el spinner de carga

  const normalizedRole = (user?.role || "citizen").toLowerCase();
  const isAdmin = normalizedRole === "admin";
  const isNurse = normalizedRole === "nurse";
  const isCitizen = normalizedRole === "citizen";

  const menuItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/patients", icon: Users, label: "Pacientes" },
    ...(isAdmin || isNurse ? [{ path: "/vaccines", icon: Syringe, label: "Vacunas" }] : []),
    ...(isAdmin || isNurse || isCitizen ? [{ path: "/campaigns", icon: Calendar, label: "Campañas" }] : []),
    ...(isAdmin || isNurse || isCitizen ? [{ path: "/outbreaks", icon: ShieldAlert, label: "Alertas Sanitarias" }] : []),
    ...(isAdmin ? [{ path: "/users", icon: Users, label: "Usuarios" }] : []),
    ...(isAdmin || isNurse || isCitizen ? [{ path: "/health-centers", icon: Building, label: "Centros de Salud" }] : []),
  ];

  // Módulos estáticos para que siempre salgan si el usuario busca sus nombres
  const staticModules = menuItems.map(item => ({
    type: "Módulo",
    label: item.label,
    path: item.path,
    icon: item.icon
  }));

  // --- LÓGICA DE BÚSQUEDA DINÁMICA (ANTIRREBOTE / DEBOUNCE) ---
  useEffect(() => {
    // Si la búsqueda está vacía, limpiamos
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Creamos un retraso de 300ms antes de llamar al backend
    const delayDebounceFn = setTimeout(async () => {
      try {
        // Buscamos módulos estáticos en el frontend
        const matchedModules = staticModules.filter(m => 
          m.label.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Buscamos datos reales en el backend (MySQL)
        const res = await fetchGlobalSearch(searchQuery);
        let dynamicData = [];
        
        if (res.success) {
          // Les asignamos el icono correspondiente según su tipo
          dynamicData = res.data.map(item => ({
            ...item,
            icon: item.type === 'Paciente' ? User : item.type === 'Vacuna' ? Syringe : Calendar
          }));
        }

        // 3. Juntamos módulos + datos de MySQL
        setSearchResults([...matchedModules, ...dynamicData]);
      } catch (error) {
        console.error("Error al buscar:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300 milisegundos de retraso (Debounce)

    return () => clearTimeout(delayDebounceFn); // Limpiamos el timer si el usuario sigue tecleando
  }, [searchQuery]);

  // Atajo de teclado (Ctrl + K o Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSelectResult = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

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
    }).then(async (result) => {
      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex relative">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Barra Lateral) */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <X size={20} />
        </button>

        <div className="p-6 border-b border-slate-100 flex flex-col items-center mt-6 md:mt-0">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-2xl mb-3 shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </div>
          <h3 className="font-bold text-slate-800 text-lg truncate w-full text-center">
            {user?.email?.split("@")[0]}
          </h3>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1">
            {isAdmin ? "Administrador" : isNurse ? "Enfermera" : "Paciente"}
          </p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-6 py-3 font-medium transition-colors border-l-4 ${
                      isActive ? "border-primary text-primary bg-blue-50" : "border-transparent text-slate-500 hover:text-primary hover:bg-slate-50"
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

        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogoutClick} className="flex items-center gap-3 w-full px-4 py-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium">
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="bg-primary text-white h-16 shrink-0 flex items-center justify-between px-6 shadow-md z-10">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 hover:bg-blue-800 rounded-lg transition-colors" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold tracking-wide">VacunApp MX</h2>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hover:text-blue-200 transition-colors flex items-center gap-2 bg-blue-800/40 px-3 py-1.5 rounded-xl border border-blue-400/30 cursor-pointer"
            >
              <Search size={18} />
              <span className="hidden sm:inline text-xs font-medium text-blue-100">Buscar...</span>
              <kbd className="hidden md:inline-block bg-blue-900 text-[10px] px-1.5 py-0.5 rounded border border-blue-700 font-mono text-blue-200">
                Ctrl K
              </kbd>
            </button>

            <button className="relative hover:text-blue-200 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full border-2 border-primary"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* MODAL DE BÚSQUEDA GLOBAL DINÁMICO */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center pt-20 bg-slate-900/60 backdrop-blur-sm p-4 animate-fadeIn" onClick={() => setIsSearchOpen(false)}>
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Search className="text-slate-400 w-5 h-5 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Escribe para buscar pacientes, vacunas, campañas o módulos..."
                className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 font-medium text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {isSearching && <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />}
              <button onClick={() => setIsSearchOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {searchQuery.trim().length < 2 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-sm font-medium">Escribe al menos 2 letras para buscar en la base de datos.</p>
                </div>
              ) : searchResults.length > 0 ? (
                <ul className="space-y-1">
                  {searchResults.map((result, idx) => {
                    const ResultIcon = result.icon || Search;
                    return (
                      <li key={idx}>
                        <div onClick={() => handleSelectResult(result.path)} className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/80 cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-primary rounded-lg shrink-0 transition-colors">
                              <ResultIcon size={18} />
                            </div>
                            <div className="truncate">
                              <p className="text-sm font-semibold text-slate-800 group-hover:text-primary truncate">
                                {result.label}
                              </p>
                              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                                {result.type}
                              </span>
                            </div>
                          </div>
                          <ArrowRight size={16} className="text-slate-300 group-hover:text-primary shrink-0 ml-2" />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : !isSearching ? (
                <div className="py-8 text-center text-slate-500 font-medium text-sm">
                  No se encontraron registros "<span className="text-slate-800 font-bold">{searchQuery}</span>".
                </div>
              ) : null}
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-right flex justify-between items-center text-xs text-slate-400 font-medium">
              <span>Buscando. . .</span>
              <span>Presiona <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm font-mono text-[10px] text-slate-500">ESC</kbd> para salir</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};