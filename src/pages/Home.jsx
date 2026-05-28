import { useState, useEffect } from 'react';
import { obtenerProductos } from '../services/productoService';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarCatalogo = async () => {
            try {
                const data = await obtenerProductos();
                setProductos(data);
            } catch (err) {
                console.error('Error al cargar productos:', err);
                setError('No se pudo establecer conexión con el catálogo.');
            } finally {
                setLoading(false);
            }
        };

        cargarCatalogo();
    }, []);

    if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-secondary)' }}>Cargando catálogo de productos...</div>;
    if (error) return <div style={{ padding: '40px', color: 'var(--color-secondary)', textAlign: 'center', fontWeight: 'bold' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '30px', color: 'var(--color-text)', textAlign: 'center' }}>Catálogo Disponible</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {productos.map(producto => (
                    <div key={producto.ID_PRODUCTO} style={{
                        backgroundColor: 'var(--color-white)',
                        border: '1px solid var(--color-border)',
                        padding: '20px',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(255, 183, 178, 0.2)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Espacio reservado para la imagen del producto */}
                        <div style={{ height: '200px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', marginBottom: '15px' }}></div>
                        
                        <h3 style={{ marginTop: '0', color: 'var(--color-text)' }}>{producto.NOMBRE_PROD}</h3>
                        <p style={{ color: 'var(--color-secondary)', margin: '5px 0', fontSize: '14px' }}>
                            {producto.Categoria?.NOMBRE_CAT || 'N/A'} • {producto.Franquicia?.NOMBRE_FRANQ || 'N/A'}
                        </p>
                        <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0', color: 'var(--color-text)' }}>
                            ${producto.PRECIO_PROD}
                        </p>
                        
                        <div style={{ marginTop: 'auto' }}>
                            <button style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-text)',
                                border: 'none',
                                borderRadius: '25px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '15px',
                                transition: 'background-color 0.3s'
                            }}>
                                Agregar al Carrito
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;