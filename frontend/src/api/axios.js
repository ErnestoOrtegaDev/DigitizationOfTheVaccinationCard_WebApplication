import axios from 'axios';
import Swal from 'sweetalert2';
import { useAuthStore } from '../store/authStore';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1', 
    withCredentials: true // Permite envío de cookies
});

// Interceptor de Respuestas: Escucha TODAS las respuestas del backend antes de que lleguen a tus componentes
instance.interceptors.response.use(
    (response) => {
        // Si todo sale bien, dejamos pasar la respuesta normal
        return response;
    },
    (error) => {
        // Si el backend nos responde con un error
        if (error.response && error.response.status === 401) {
            // Revisamos si el usuario creía estar logueado
            const { isAuthenticated, logout } = useAuthStore.getState();
            
            // Si el backend dice "No autorizado" y el Frontend dice "Estoy logueado", significa que la sesión expiró
            if (isAuthenticated) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Sesión expirada',
                    text: 'Por tu seguridad, tu sesión ha caducado. Por favor, inicia sesión de nuevo.',
                    confirmButtonColor: '#2563eb',
                    allowOutsideClick: false
                }).then(() => {
                    logout(); // Borra el estado y el Guardia automáticamente lo mandará a /login
                });
            }
        }
        
        // Devolvemos el error para que el componente también lo atrape si lo necesita
        return Promise.reject(error);
    }
);

export default instance;