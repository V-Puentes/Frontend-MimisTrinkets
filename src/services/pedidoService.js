import api from './api';

export const obtenerMisPedidos = async () => {
    try {
        const response = await api.get('/pedidos/mis-pedidos');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al obtener el historial de pedidos';
    }
};