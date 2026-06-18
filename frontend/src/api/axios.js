import axios from 'axios';

const axiosInstance = axios.create({
    // La URL del backend - actualizar a variable de entorno {NECESARIO}
    baseURL: 'http://localhost:4000/api/v1',
    // ¡CRÍTICO! Esto permite que el navegador reciba y envíe las Cookies HttpOnly
    withCredentials: true 
});

export default axiosInstance;