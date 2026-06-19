import { create } from 'zustand';
import axios from '../api/axios'; 

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isChecking: true, // Para cuando verificamos la cookie al recargar la página

    // Acción: Iniciar sesión (recibe los datos del backend)
    login: (userData) => {
        set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
            isChecking: false
        });
    },

    // Acción: Cerrar sesión
    logout: async () => {
        try {
            set({ isLoading: true });
            // Opcional: Avisar al backend para que destruya la cookie/token
            // await axios.post('/auth/logout'); 
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        } finally {
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
            // El backend debe tener un endpoint /auth/me que lea la cookie httpOnly y devuelva el usuario
            const response = await axios.get('/auth/me');
            set({
                user: response.data.user,
                isAuthenticated: true,
                isChecking: false
            });
        } catch (error) {
            // Si da error (no hay cookie o expiró), limpiamos el estado
            set({
                user: null,
                isAuthenticated: false,
                isChecking: false
            });
        }
    }
}));