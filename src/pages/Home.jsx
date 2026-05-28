import { useState, useEffect } from 'react';
import { obtenerProductos } from '../services/productoService';
import { useCarrito } from '../context/CarritoContext';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { agregarItem } = useCarrito();

    useEffect(() => {
        const cargarCatalogo = async () => {
            try {
                const data = await obtenerProductos();
                console.log("Respuesta del Backend:", data);
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

    // Función para formatear el precio a pesos chilenos
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(precio);
    };

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
                        {/* Renderizado de la imagen corrigiendo la ruta relativa */}
                        {producto.IMAGEN_URL ? (
                            <img 
                                src={producto.IMAGEN_URL.replace('./', '/')} 
                                alt={producto.NOMBRE_PROD} 
                                style={{ width: '100%', height: '200px', objectFit: 'contain', marginBottom: '15px', borderRadius: '8px' }} 
                            />
                        ) : (
                            <div style={{ height: '200px', backgroundColor: 'var(--color-bg)', borderRadius: '8px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <span style={{ color: 'var(--color-secondary)' }}>Sin imagen</span>
                            </div>
                        )}
                        
                        <h3 style={{ marginTop: '0', color: 'var(--color-text)' }}>{producto.NOMBRE_PROD}</h3>
                        
                        {/* Corrección de los alias generados por Sequelize */}
                        <p style={{ color: 'var(--color-secondary)', margin: '5px 0', fontSize: '14px' }}>
                            {producto.Categorium?.NOMBRE_CAT || 'Sin Categoría'} • {producto.Franquicium?.NOMBRE_FRANQ || 'Sin Franquicia'}
                        </p>
                        
                        <p style={{ fontSize: '22px', fontWeight: 'bold', margin: '15px 0', color: 'var(--color-text)' }}>
                            {formatearPrecio(producto.PRECIO_PROD)}
                        </p>
                        
                        <div style={{ marginTop: 'auto' }}>
                            <button 
                                onClick={() => agregarItem(producto.ID_PRODUCTO)}
                                style={{ 
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