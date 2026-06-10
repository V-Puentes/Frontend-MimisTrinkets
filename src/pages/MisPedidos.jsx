import { useState, useEffect } from 'react';
import { obtenerMisPedidos } from '../services/pedidoService';

const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const data = await obtenerMisPedidos();
                setPedidos(data);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el historial de pedidos.');
            } finally {
                setLoading(false);
            }
        };
        cargarHistorial();
    }, []);

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    const formatearFecha = (fechaStr) => {
        return new Date(fechaStr).toLocaleDateString('es-CL', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-secondary)' }}>Cargando historial de pedidos...</div>;
    if (error) return <div style={{ padding: '40px', color: '#c62828', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '30px' }}>Mis Pedidos</h1>
            
            {pedidos.length === 0 ? (
                <p style={{ color: 'var(--color-secondary)' }}>Aún no has realizado ninguna compra.</p>
            ) : (
                pedidos.map((pedido, index) => {
                    // Costo de envío estático solicitado
                    const costoEnvio = 2000;
                    // Conversión segura de los valores de la base de datos
                    const subtotalNeto = Number(pedido.SUBTOTAL || 0);
                    const valorIva = Number(pedido.VALOR_IVA || 0);
                    const totalProductosConIva = Number(pedido.TOTAL_CON_IVA || 0);
                    const totalGeneral = totalProductosConIva + costoEnvio;

                    return (
                        <div key={pedido.ID_PEDIDO || index} style={{
                            backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', 
                            border: '1px solid var(--color-border)', marginBottom: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            {/* Cabecera del Pedido */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--color-bg)', paddingBottom: '15px', marginBottom: '15px' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 5px 0', color: 'var(--color-text)' }}>Pedido #{pedido.ID_PEDIDO}</h3>
                                    <span style={{ fontSize: '14px', color: 'var(--color-secondary)' }}>Fecha: {formatearFecha(pedido.FECHA_PEDIDO)}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        backgroundColor: pedido.EstadoPedido?.NOMBRE_ESTADO === 'Entregado' ? '#e8f5e9' : '#fff3e0', 
                                        color: pedido.EstadoPedido?.NOMBRE_ESTADO === 'Entregado' ? '#2e7d32' : '#ef6c00',
                                        padding: '5px 12px', borderRadius: '15px', fontWeight: 'bold', fontSize: '14px'
                                    }}>
                                        {pedido.EstadoPedido?.NOMBRE_ESTADO || 'Procesando'}
                                    </span>
                                </div>
                            </div>

                            {/* Detalles logísticos */}
                            <div style={{ fontSize: '14px', color: 'var(--color-text)', marginBottom: '15px' }}>
                                <p style={{ margin: '3px 0' }}><strong>Dirección de Envío:</strong> {pedido.DIRECCION_ENVIO}</p>
                                <p style={{ margin: '3px 0' }}><strong>Método de Pago:</strong> {pedido.MetodoPago?.NOMBRE_METODO || 'No especificado'}</p>
                            </div>

                            {/* Productos incluidos */}
                            <div style={{ backgroundColor: 'var(--color-bg)', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)', fontSize: '14px' }}>Artículos:</h4>
                                {pedido.DetallePedidos?.map((item, itemIndex) => (
                                    <div key={item.ID_DETALLE_PEDIDO || itemIndex} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', padding: '5px 0' }}>
                                        <span style={{ color: 'var(--color-text)' }}>
                                            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>{item.CANTIDAD}x</span>
                                            {item.Producto?.NOMBRE_PROD || 'Producto no disponible'}
                                        </span>
                                        <span style={{ fontWeight: 'bold', color: 'var(--color-text)' }}>
                                            {formatearPrecio(Number(item.PRECIO_UNITARIO || 0) * item.CANTIDAD)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Resumen Financiero Desglosado */}
                            <div style={{ 
                                display: 'flex', flexDirection: 'column', alignItems: 'flex-end', 
                                gap: '5px', fontSize: '14px', paddingTop: '10px', borderTop: '1px dashed var(--color-border)' 
                            }}>
                                <div style={{ color: 'var(--color-text)' }}>
                                    <span>Subtotal Neto: </span>
                                    <span style={{ fontWeight: '500' }}>{formatearPrecio(subtotalNeto)}</span>
                                </div>
                                <div style={{ color: 'var(--color-text)' }}>
                                    <span>IVA (19%): </span>
                                    <span style={{ fontWeight: '500' }}>{formatearPrecio(valorIva)}</span>
                                </div>
                                <div style={{ color: 'var(--color-text)' }}>
                                    <span>Costo de Envío: </span>
                                    <span style={{ fontWeight: '500' }}>{formatearPrecio(costoEnvio)}</span>
                                </div>
                                <div style={{ 
                                    fontSize: '16px', fontWeight: 'bold', color: 'var(--color-secondary)', 
                                    marginTop: '5px', paddingTop: '5px', borderTop: '1px solid var(--color-bg)' 
                                }}>
                                    <span>Total Pagado: </span>
                                    <span>{formatearPrecio(totalGeneral)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default MisPedidos;