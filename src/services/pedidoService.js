import api from './api';

export const obtenerMisPedidos = async () => {
    try {
        const response = await api.get('/pedidos/mis-pedidos');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al obtener el historial de pedidos';
    }
};

export const obtenerTodosLosPedidos = async () => {
    const response = await api.get('/pedidos');
    return response.data;
};

export const actualizarEstadoPedido = async (id, estadoId) => {
    const response = await api.put(`/pedidos/${id}`, { ESTADO_ID: estadoId });
    return response.data;
};