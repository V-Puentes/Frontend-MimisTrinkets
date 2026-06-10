import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useAuth } from '../context/AuthContext';
import { procesarCheckoutAPI } from '../services/carritoService';
import { chileData } from '../utils/chileData'; // Asegure la ruta correcta
import api from '../services/api';

const Checkout = () => {
    const { carrito, cargarCarrito } = useCarrito();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Estados del formulario de despacho y facturación
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [calle, setCalle] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [metodoPago, setMetodoPago] = useState('1'); // 1: Webpay, 3: Transferencia
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    // Carga de datos iniciales del usuario
    useEffect(() => {
        if (user) {
            setNombre(user.nombre || user.NOMBRE || '');
            setRut(user.rut || user.RUT || '');
            
            const direccionGuardada = user.direccion || user.DIRECCION;
            if (direccionGuardada && direccionGuardada.includes(',')) {
                const partes = direccionGuardada.split(',').map(p => p.trim());
                if (partes.length >= 3) {
                    setCalle(partes[0]);
                    const regionEncontrada = chileData.find(item => item.region === partes[2]);
                    if (regionEncontrada) {
                        setRegion(partes[2]);
                        setComunasDisponibles(regionEncontrada.comunas);
                        setComuna(partes[1]);
                    }
                }
            }
        }
    }, [user]);

    const handleRegionChange = (e) => {
        const nuevaRegion = e.target.value;
        setRegion(nuevaRegion);
        const regionData = chileData.find(item => item.region === nuevaRegion);
        setComunasDisponibles(regionData ? regionData.comunas : []);
        setComuna('');
    };

    // Cálculos Financieros Exactos
    const totalProductos = carrito.DetalleCarritos?.reduce((total, item) => {
        return total + (Number(item.Producto.PRECIO_PROD) * item.CANTIDAD);
    }, 0) || 0;

    const COSTO_ENVIO = 2000;
    const montoNeto = Math.round(totalProductos / 1.19);
    const montoIva = totalProductos - montoNeto;
    const totalFinal = totalProductos + COSTO_ENVIO;

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    const handleProcesarPago = async (e) => {
        e.preventDefault();
        if (!region || !comuna || !calle.trim() || !nombre.trim() || !rut.trim()) {
            setError('Todos los campos de datos y envío son obligatorios.');
            return;
        }

        setLoading(true);
        setError('');
        const direccionCompleta = `${calle.trim()}, ${comuna}, ${region}`;

        try {
            // Flujo 1: Webpay Plus (Transbank)
            if (metodoPago === '1') {
                // 1. Se solicita al backend la creación de la transacción
                const { data } = await api.post('/transbank/crear-transaccion', {
                    monto: totalFinal,
                    ordenCompra: `MT-${Date.now()}`,
                    sessionId: user.id
                });

                // 2. Transbank responde con una URL y un Token. Se debe enviar un formulario POST automático.
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.url;

                const tokenInput = document.createElement('input');
                tokenInput.type = 'hidden';
                tokenInput.name = 'token_ws';
                tokenInput.value = data.token;

                form.appendChild(tokenInput);
                document.body.appendChild(form);
                form.submit(); 
                // La ejecución del frontend termina aquí temporalmente hasta que Transbank retorne.
            } 
            // Flujo 2: Pago Manual (Transferencia)
            else {
                await procesarCheckoutAPI({
                    total: totalFinal,
                    DIRECCION_ENVIO: direccionCompleta,
                    METODO_PAGO_ID: parseInt(metodoPago, 10),
                    NOTAS: comentarios
                });
                await cargarCarrito();
                navigate('/mis-pedidos');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al conectar con el servidor de pagos.');
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
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '30px', textAlign: 'center' }}>Checkout Seguro</h1>
            
            {error && (
                <div style={{ backgroundColor: '#ffebee', color: '#c62828', padding: '15px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px', alignItems: 'start' }}>
                
                {/* COLUMNA 1: Formulario de Identificación y Envío */}
                <form id="form-checkout" onSubmit={handleProcesarPago} style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    <div>
                        <h3 style={{ marginTop: 0, color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px' }}>1. Datos de Facturación</h3>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nombre Completo *</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                            </div>
                            <div style={{ flex: 1, minWidth: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>RUT *</label>
                                <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} required placeholder="Ej: 12.345.678-K" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginTop: '10px', color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px' }}>2. Despacho a Domicilio</h3>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Región *</label>
                                <select value={region} onChange={handleRegionChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}>
                                    <option value="">Seleccione Región...</option>
                                    {chileData.map((item, idx) => (
                                        <option key={idx} value={item.region}>{item.region}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Comuna *</label>
                                <select value={comuna} onChange={(e) => setComuna(e.target.value)} required disabled={comunasDisponibles.length === 0} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box', backgroundColor: comunasDisponibles.length === 0 ? 'var(--color-bg)' : 'var(--color-white)' }}>
                                    <option value="">Seleccione Comuna...</option>
                                    {comunasDisponibles.map((com, idx) => (
                                        <option key={idx} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Calle y Número (Depto/Casa) *</label>
                            <input type="text" value={calle} onChange={(e) => setCalle(e.target.value)} required placeholder="Ej: Concha y Toro 1340, Depto 402" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Comentarios adicionales (Opcional)</label>
                            <textarea value={comentarios} onChange={(e) => setComentarios(e.target.value)} rows="2" placeholder="Indicaciones para el repartidor..." style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                        </div>
                    </div>

                    <div>
                        <h3 style={{ marginTop: '10px', color: 'var(--color-secondary)', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px' }}>3. Medio de Pago</h3>
                        <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-secondary)', boxSizing: 'border-box', backgroundColor: '#fff8f9', fontWeight: 'bold', color: 'var(--color-text)' }}>
                            <option value="1">💳 Tarjeta de Crédito / Débito (Webpay Plus)</option>
                            <option value="3">🏦 Transferencia Bancaria Manual</option>
                        </select>
                    </div>
                </form>

                {/* COLUMNA 2: Resumen Financiero y Botón de Pago */}
                <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 15px rgba(226, 132, 149, 0.1)', height: 'fit-content', position: 'sticky', top: '90px' }}>
                    <h3 style={{ marginTop: 0, borderBottom: '2px solid var(--color-border)', paddingBottom: '10px', color: 'var(--color-secondary)' }}>Detalle de la Orden</h3>
                    
                    <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '20px', paddingRight: '10px' }}>
                        {carrito.DetalleCarritos.map(item => (
                            <div key={item.ID_DETALLE_CAR} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', padding: '12px 0', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-text)', fontSize: '14px', flex: 1 }}>
                                    <span style={{ fontWeight: 'bold', color: 'var(--color-secondary)', marginRight: '8px' }}>{item.CANTIDAD}x</span> 
                                    {item.Producto.NOMBRE_PROD}
                                </span>
                                <span style={{ fontWeight: 'bold', color: 'var(--color-text)', fontSize: '14px', whiteSpace: 'nowrap' }}>
                                    {formatearPrecio(item.Producto.PRECIO_PROD * item.CANTIDAD)}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Cálculos Contables */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '2px solid var(--color-border)', paddingTop: '20px', fontSize: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
                            <span>Subtotal (Neto)</span>
                            <span>{formatearPrecio(montoNeto)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
                            <span>IVA (19%)</span>
                            <span>{formatearPrecio(montoIva)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-secondary)' }}>
                            <span>Costo Logístico de Envío</span>
                            <span>{formatearPrecio(COSTO_ENVIO)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '22px', fontWeight: 'bold', color: 'var(--color-primary)' }}>
                            <span>Total a Pagar</span>
                            <span>{formatearPrecio(totalFinal)}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        form="form-checkout"
                        disabled={loading}
                        style={{
                            width: '100%', padding: '15px', backgroundColor: 'var(--color-primary)', 
                            color: 'var(--color-white)', border: 'none', borderRadius: '8px', 
                            cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '18px', marginTop: '30px',
                            transition: 'background-color 0.3s', opacity: loading ? 0.7 : 1, textTransform: 'uppercase'
                        }}
                    >
                        {loading ? 'Redirigiendo...' : (metodoPago === '1' ? 'Ir a Webpay Plus' : 'Confirmar Pedido')}
                    </button>
                    
                    {metodoPago === '1' && (
                        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-secondary)', marginTop: '15px' }}>
                            Serás redirigido al portal seguro de Transbank.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Checkout;