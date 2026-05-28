import { useNavigate } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';

const CarritoModal = () => {
    const { carrito, quitarItem, agregarItem, restarItem, isModalOpen, toggleModal } = useCarrito();
    const navigate = useNavigate();

    if (!isModalOpen) return null;

    const totalCarrito = carrito.DetalleCarritos?.reduce((total, item) => {
        return total + (item.Producto.PRECIO_PROD * item.CANTIDAD);
    }, 0) || 0;

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    const procederAlPago = () => {
        toggleModal();
        navigate('/checkout');
    };

    return (
        <>
            <div onClick={toggleModal} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999 }} />
            <div style={{ position: 'fixed', top: 0, right: 0, width: '350px', height: '100%', backgroundColor: 'var(--color-bg)', zIndex: 1000, boxShadow: '-4px 0 15px rgba(226, 132, 149, 0.2)', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid var(--color-border)', paddingBottom: '15px' }}>
                    <h2 style={{ margin: 0, color: 'var(--color-text)' }}>Tu Carrito</h2>
                    <button onClick={toggleModal} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-secondary)' }}>✖</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '15px 0' }}>
                    {carrito.DetalleCarritos?.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--color-secondary)' }}>El carrito está vacío.</p>
                    ) : (
                        carrito.DetalleCarritos?.map(item => (
                            <div key={item.ID_DETALLE_CAR} style={{ display: 'flex', gap: '15px', marginBottom: '15px', padding: '10px', backgroundColor: 'var(--color-white)', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: 'var(--color-text)' }}>{item.Producto.NOMBRE_PROD}</h4>
                                    
                                    {/* Controles de Cantidad */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0' }}>
                                        <button 
                                            onClick={() => restarItem(item.PRODUCTO_ID, item.ID_DETALLE_CAR, item.CANTIDAD)}
                                            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', width: '25px', height: '25px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-text)' }}
                                        >-</button>
                                        
                                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--color-text)' }}>{item.CANTIDAD}</span>
                                        
                                        <button 
                                            onClick={() => agregarItem(item.PRODUCTO_ID)}
                                            style={{ background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', width: '25px', height: '25px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-text)' }}
                                        >+</button>
                                    </div>

                                    <p style={{ margin: '5px 0 0 0', fontWeight: 'bold' }}>{formatearPrecio(item.Producto.PRECIO_PROD)}</p>
                                </div>
                                <button 
                                    onClick={() => quitarItem(item.ID_DETALLE_CAR)}
                                    style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start', fontSize: '12px' }}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {carrito.DetalleCarritos?.length > 0 && (
                    <div style={{ borderTop: '2px solid var(--color-border)', paddingTop: '15px' }}>
                        <h3 style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text)' }}>
                            <span>Total:</span> <span>{formatearPrecio(totalCarrito)}</span>
                        </h3>
                        <button onClick={procederAlPago} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-primary)', color: 'var(--color-text)', border: 'none', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                            Proceder al Pago
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default CarritoModal;