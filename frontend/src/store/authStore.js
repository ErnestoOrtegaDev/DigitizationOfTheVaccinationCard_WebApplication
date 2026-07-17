import { create } from 'zustand';
import axios from '../api/axios'; 

export const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isChecking: true,

    setToken: (token) => set({ token }),

    // Acción: Iniciar sesión (recibe los datos del backend)
    login: (userData) => {
        const normalizedUser = {
            id: userData?.id ?? null,
            email: userData?.email ?? null,
            role: userData?.role ?? 'citizen',
        };

        set({
            user: normalizedUser,
            isAuthenticated: true,
            isLoading: false,
            isChecking: false
        });
    },

    // Acción: Cerrar sesión
    logout: async () => {
        try {
            set({ isLoading: true });
            // Llamamos al backend para que destruya las cookies y limpie la BD
            await axios.post('/auth/logout'); 
        } catch (error) {
            console.error("Error al cerrar sesión en el backend", error);
        } finally {
            // Independientemente de si el backend falló, limpiamos el frontend por seguridad
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                isChecking: false
            });
        }
    },

    // Acción: Verificar si hay sesión activa (para cuando el usuario recarga la pestaña con F5)
    checkAuth: async () => {
        try {
            const response = await axios.get('/auth/me');
            const normalizedUser = response.data.user ?? response.data.userData ?? null;
            const safeUser = normalizedUser
                ? {
                    id: normalizedUser.id ?? null,
                    email: normalizedUser.email ?? null,
                    role: normalizedUser.role ?? 'citizen',
                }
                : null;

            set({
                user: safeUser,
                isAuthenticated: Boolean(safeUser),
                isChecking: false
            });
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isChecking: false
            });
        }
    }
}));