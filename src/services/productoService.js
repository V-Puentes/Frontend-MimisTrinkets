import api from './api';

export const obtenerProductos = async () => {
    try {
        const response = await api.get('/productos');
        return response.data;
    } catch (error) {
        console.error('Error en la petición de productos:', error);
        throw error;
    }
};