import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = () => {
    // Extraemos el estado directamente de Zustand
    const { isAuthenticated, isChecking } = useAuthStore();

    // Mientras verificamos la cookie en el backend (al recargar la página)
    if (isChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    // Si terminó de checar y no hay sesión válida, lo pateamos al login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si tiene sesión, renderizamos la ruta hija (ej. Dashboard)
    return <Outlet />;
};