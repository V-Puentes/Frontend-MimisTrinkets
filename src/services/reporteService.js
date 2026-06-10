import api from './api';

export const obtenerDatosInventario = async (limite) => {
    const response = await api.get(`/reportes/inventario/datos?limite=${limite}`);
    return response.data;
};

export const descargarInventarioExcel = async (limite) => {
    const response = await api.get(`/reportes/inventario/excel?limite=${limite}`, { responseType: 'blob' });
    return response.data;
};

export const obtenerDatosVentas = async (fechaInicio, fechaFin) => {
    const response = await api.get(`/reportes/ventas/datos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
    return response.data;
};

export const descargarVentasPDF = async (fechaInicio, fechaFin) => {
    const response = await api.get(`/reportes/ventas/pdf?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, { responseType: 'blob' });
    return response.data;
};