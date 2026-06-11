import axios from 'axios';

const api = axios.create({
    // En desarrollo usará localhost, en producción usará la URL de Render
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor para agregar el token JWT (si aplica)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;