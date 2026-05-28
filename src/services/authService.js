import api from './api';

export const loginUsuario = async (credenciales) => {
    try {
        const response = await api.post('/auth/login', credenciales);
        return response.data;
    } catch (error) {
        // Extraer el mensaje de error enviado por el backend
        throw error.response?.data?.message || 'Error al conectar con el servidor';
    }
};