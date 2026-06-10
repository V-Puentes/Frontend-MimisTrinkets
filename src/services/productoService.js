import api from './api';

export const obtenerProductos = async () => {
    const response = await api.get('/productos');
    return response.data;
};

export const crearProducto = async (productoData) => {
    const response = await api.post('/productos', productoData);
    return response.data;
};

export const actualizarProducto = async (id, productoData) => {
    const response = await api.put(`/productos/${id}`, productoData);
    return response.data;
};

export const eliminarProducto = async (id) => {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
};

export const obtenerCategorias = async () => {
    const response = await api.get('/categorias'); // Asegúrese de que este endpoint exista en su backend
    return response.data;
};

export const obtenerFranquicias = async () => {
    const response = await api.get('/franquicias'); // Asegúrese de que este endpoint exista en su backend
    return response.data;
};