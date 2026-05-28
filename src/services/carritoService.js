import api from './api';

export const obtenerCarrito = async () => {
    try {
        const response = await api.get('/carrito');
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al obtener el carrito';
    }
};

export const agregarProductoCarrito = async (productoId, cantidad = 1) => {
    try {
        const response = await api.post('/carrito/agregar', { PRODUCTO_ID: productoId, CANTIDAD: cantidad });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al agregar producto';
    }
};

export const quitarProductoCarrito = async (detalleId) => {
    try {
        const response = await api.delete(`/carrito/quitar/${detalleId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al eliminar producto';
    }
};

export const procesarCheckoutAPI = async (datosCheckout) => {
    try {
        const response = await api.post('/checkout', datosCheckout);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al procesar la compra';
    }
};

export const restarProductoCarrito = async (productoId) => {
    try {
        const response = await api.post('/carrito/restar', { PRODUCTO_ID: productoId });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || 'Error al disminuir cantidad';
    }
};