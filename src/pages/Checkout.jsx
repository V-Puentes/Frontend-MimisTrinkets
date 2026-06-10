import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { procesarCheckoutAPI } from '../services/carritoService';

const Checkout = () => {
    const { carrito, cargarCarrito } = useCarrito();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    // Estados
    const [direccion, setDireccion] = useState('');
    const [metodoPago, setMetodoPago] = useState('1');

    const totalCarrito = carrito.DetalleCarritos?.reduce((total, item) => {
        return total + (item.Producto.PRECIO_PROD * item.CANTIDAD);
    }, 0) || 0;

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    const handleProcesarPago = async (e) => {
        e.preventDefault();
        if (!direccion.trim()) {
            setError('La dirección de envío es obligatoria.');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Se envían los campos requeridos por la tabla Pedido
            await procesarCheckoutAPI({
                total: totalCarrito,
                DIRECCION_ENVIO: direccion,
                METODO_PAGO_ID: parseInt(metodoPago, 10)
            });
            await cargarCarrito();
            navigate('/mis-pedidos');
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    if (!carrito.DetalleCarritos || carrito.DetalleCarritos.length === 0) {
        return (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-text)' }}>El carrito de compras está vacío</h2>
                <button onClick={() => navigate('/')} style={{ padding: '12px 25px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-white)', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}>
                    Volver al Catálogo
                </button>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '30px', textAlign: 'center' }}>Resumen de Compra</h1>
            
            {error && (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Formulario de Datos de Envío y Pago */}
                <form onSubmit={handleProcesarPago} style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px' }}>Datos de Entrega</h3>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--color-text)' }}>Dirección de Envío:</label>
                        <input
                            type="text"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)}
                            placeholder="Ej: Av. Concha y Toro 1340"
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: 'var(--color-text)' }}>Método de Pago:</label>
                        <select 
                            value={metodoPago} 
                            onChange={(e) => setMetodoPago(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '10px', 
                                borderRadius: '6px', 
                                border: '1px solid var(--color-border)', 
                                boxSizing: 'border-box',
                                backgroundColor: 'var(--color-white)',
                                color: 'var(--color-text)',
                                fontSize: '14px'
                            }}
                        >
                            <option value="1">Webpay Plus (Transbank)</option>
                            <option value="2">PayPal</option>
                            <option value="3">Transferencia Bancaria</option>
                        </select>
                    </div>
                </form>

                {/* Resumen Financiero */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 15px rgba(226, 132, 149, 0.1)' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--color-border)', paddingBottom: '10px', color: 'var(--color-secondary)' }}>Detalle</h3>
                    
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {carrito.DetalleCarritos.map(item => (
                            <div key={item.ID_DETALLE_CAR} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', padding: '10px 0', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-text)', fontSize: '14px' }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-secondary)' }}>{item.CANTIDAD}x</span> {item.Producto.NOMBRE_PROD}
                                </span>
                                <span style={{ fontWeight: 'bold', color: 'var(--color-text)', fontSize: '14px' }}>
                                    {formatearPrecio(item.Producto.PRECIO_PROD * item.CANTIDAD)}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text)', borderTop: '2px solid var(--color-border)', paddingTop: '15px' }}>
                        <span>Total:</span>
                        <span>{formatearPrecio(totalCarrito)}</span>
                    </div>

                    <button
                        onClick={handleProcesarPago}
                        disabled={loading}
                        style={{
                            width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', 
                            color: 'var(--color-text)', border: 'none', borderRadius: '25px', 
                            cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '20px',
                            transition: 'opacity 0.3s', opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Procesando...' : 'Confirmar y Pagar'}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Checkout;