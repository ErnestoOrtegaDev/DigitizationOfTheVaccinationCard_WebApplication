import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1', 
    withCredentials: true // Permite envío de cookies (ej. Refresh Token en HttpOnly)
});

// NUEVO INTERCEPTOR DE PETICIÓN (Inyecta el token en cada llamada)
instance.interceptors.request.use(
    (config) => {
        // Obtenemos el estado actual de la tienda sin usar hooks
        const { token } = useAuthStore.getState();
        
        // Si hay un token, lo mandamos en las cabeceras de autorización
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// INTERCEPTOR DE RESPUESTAS 
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            const { isAuthenticated, logout } = useAuthStore.getState();
            
            if (isAuthenticated) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión expirada',
                    text: 'Por tu seguridad, tu sesión ha caducado. Por favor, inicia sesión de nuevo.',
                    confirmButtonColor: '#2563eb',
                    allowOutsideClick: false
                }).then(() => {
                    logout(); 
                });
            }
        }
        return Promise.reject(error);
    }
);

export default instance;