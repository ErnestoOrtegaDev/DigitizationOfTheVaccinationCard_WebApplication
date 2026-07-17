import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1',
    withCredentials: true // Obligatorio para que viajen las cookies HttpOnly
});

// INTERCEPTOR DE PETICIÓN
// Como dependemos de cookies, ya no inyectamos Bearer token manualmente para evitar conflictos
instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);

// Variables para manejar la cola de peticiones mientras refrescamos
let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
    refreshSubscribers.push(cb);
};

const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
};

// INTERCEPTOR DE RESPUESTAS
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        // Si es 401 y no ha sido reintentado
        if (response && response.status === 401 && !originalRequest._retry) {
            
            // Si el 401 es en refresh o login, cerramos sesión
            if (originalRequest.url.includes('/auth/refresh') || originalRequest.url.includes('/auth/login')) {
                const { isAuthenticated, logout } = useAuthStore.getState();
                if (isAuthenticated) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión expirada',
                        text: 'Por favor, inicia sesión de nuevo.',
                        confirmButtonColor: '#2563eb',
                        allowOutsideClick: false
                    }).then(logout);
                }
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (isRefreshing) {
                // Si ya estamos refrescando, nos formamos en la cola
                return new Promise((resolve) => {
                    subscribeTokenRefresh(() => {
                        resolve(instance(originalRequest));
                    });
                });
            }

            isRefreshing = true;

            try {
                // Llamada al backend para renovar cookie (el backend debe hacer res.cookie)
                await instance.post('/auth/refresh');
                
                isRefreshing = false;
                onRefreshed();
                
                // Reintentar la petición original
                return instance(originalRequest);
                
            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                
                const { isAuthenticated, logout } = useAuthStore.getState();
                if (isAuthenticated) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Sesión caducada',
                        text: 'Tu sesión ha finalizado. Inicia sesión nuevamente.',
                        confirmButtonColor: '#2563eb',
                        allowOutsideClick: false
                    }).then(logout);
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default instance;