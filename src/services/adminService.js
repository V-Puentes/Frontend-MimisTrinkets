import api from './api';

// Métricas de ventas para reportes financieros
export const obtenerReporteVentas = async () => {
    const response = await api.get('/admin/reporte-ventas');
    return response.data;
};

// CRUD: Categorías
export const crearCategoria = async (data) => {
    const response = await api.post('/admin/categorias', data);
    return response.data;
};

export const actualizarCategoria = async (id, data) => {
    const response = await api.put(`/admin/categorias/${id}`, data);
    return response.data;
};

export const eliminarCategoria = async (id) => {
    const response = await api.delete(`/admin/categorias/${id}`);
    return response.data;
};