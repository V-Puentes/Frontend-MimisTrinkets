import { useState, useEffect } from 'react';
import { obtenerProductos, obtenerCategorias } from '../services/productoService';
import { useCarrito } from '../context/CarritoContext';

const Home = () => {
    // Se extrae el contexto del carrito
const { agregarItem } = useCarrito();

    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [imagenModal, setImagenModal] = useState(null);

    useEffect(() => {
        const cargarCatalogo = async () => {
            try {
                const [productosData, categoriasData] = await Promise.all([
                    obtenerProductos(),
                    obtenerCategorias()
                ]);
                setProductos(productosData);
                setCategorias(categoriasData);
            } catch (err) {
                console.error(err);
                setError('No se pudo cargar el catálogo de productos.');
            } finally {
                setLoading(false);
            }
        };
        cargarCatalogo();
    }, []);

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    const productosFiltrados = productos.filter(producto => {
        const coincideTexto = producto.NOMBRE_PROD.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSeleccionada 
            ? Number(producto.CATEGORIA_ID) === Number(categoriaSeleccionada)
            : true;
        return coincideTexto && coincideCategoria;
    });

    if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-secondary)' }}>Cargando catálogo...</div>;
    if (error) return <div style={{ padding: '80px', color: '#c62828', textAlign: 'center' }}>{error}</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)', width: '100%' }}>
            
            {/* 1. BANNER PRINCIPAL */}
            <div style={{
                backgroundColor: 'var(--color-primary)',
                backgroundImage: 'linear-gradient(135deg, var(--color-primary) 0%, #fbc5d0 100%)',
                boxShadow: 'inset 0 -5px 15px rgba(0,0,0,0.05)',
                width: '100%'
            }}>
                <div style={{
                    maxWidth: '1500px',
                    width: '100%',
                    margin: '0 auto',
                    padding: '40px 4%',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '40px',
                    flexWrap: 'wrap',
                    boxSizing: 'border-box'
                }}>
                    <img 
                        src="/assets/png/logo.png" 
                        alt="Mimis Trinkets Logo" 
                        style={{ height: '250px', maxWidth: '100%', objectFit: 'contain' }} 
                    />
                    <div style={{ textAlign: 'left', flex: '1', minWidth: '300px', color: 'var(--color-text)' }}>
                        <h1 style={{ fontSize: '36px', margin: '0 0 10px 0', fontWeight: 'bold' }}>¡Bienvenidos a Mimis Trinkets!</h1>
                        <p style={{ fontSize: '18px', margin: 0, opacity: 0.9 }}>Encuentra los mejores accesorios, papelería y coleccionables exclusivos</p>
                    </div>
                </div>
            </div>

            {/* CONTENEDOR CENTRAL DE LA INTERFAZ */}
            <div style={{ maxWidth: '1500px', width: '100%', margin: '0 auto', padding: '40px 4%', boxSizing: 'border-box' }}>
                
                {/* 2. SECCIÓN DE CATEGORÍAS DESTACADAS */}
                <h2 style={{ color: 'var(--color-text)', marginBottom: '20px', fontSize: '22px' }}>Categorías Destacadas</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                    gap: '25px',
                    marginBottom: '50px',
                    width: '100%'
                }}>
                    {categorias.map(cat => (
                        <div 
                            key={cat.ID_CATEGORIA}
                            onClick={() => setCategoriaSeleccionada(cat.ID_CATEGORIA)}
                            style={{
                                backgroundColor: 'var(--color-white)',
                                padding: '45px 30px', 
                                borderRadius: '14px',
                                border: categoriaSeleccionada === cat.ID_CATEGORIA ? '2px solid var(--color-secondary)' : '1px solid var(--color-border)',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.03)',
                                fontWeight: 'bold',
                                fontSize: '18px', 
                                color: 'var(--color-text)',
                                boxSizing: 'border-box'
                            }}
                        >
                            <div style={{ fontSize: '32px', marginBottom: '15px' }}>✨</div>
                            {cat.NOMBRE_CAT}
                        </div>
                    ))}
                </div>

                {/* 3. BARRA DE BÚSQUEDA Y FILTROS */}
                <div style={{ 
                    backgroundColor: 'var(--color-white)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px solid var(--color-border)', 
                    marginBottom: '30px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <div style={{ width: '100%' }}>
                        <input 
                            type="text"
                            placeholder="🔍 Buscar productos por nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                border: '1px solid var(--color-border)',
                                fontSize: '15px',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--color-text)' }}>Filtrar por:</span>
                        <button 
                            onClick={() => setCategoriaSeleccionada(null)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                cursor: 'pointer',
                                fontWeight: '500',
                                backgroundColor: categoriaSeleccionada === null ? 'var(--color-secondary)' : 'var(--color-bg)',
                                color: categoriaSeleccionada === null ? 'var(--color-white)' : 'var(--color-text)'
                            }}
                        >
                            Todos los Productos
                        </button>
                        {categorias.map(cat => (
                            <button
                                key={cat.ID_CATEGORIA}
                                onClick={() => setCategoriaSeleccionada(cat.ID_CATEGORIA)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    backgroundColor: categoriaSeleccionada === cat.ID_CATEGORIA ? 'var(--color-secondary)' : 'var(--color-bg)',
                                    color: categoriaSeleccionada === cat.ID_CATEGORIA ? 'var(--color-white)' : 'var(--color-text)'
                                }}
                            >
                                {cat.NOMBRE_CAT}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 4. INVENTARIO DEL CATÁLOGO */}
                <h2 style={{ color: 'var(--color-text)', marginBottom: '20px', fontSize: '22px' }}>Nuestro Catálogo</h2>
                
                {productosFiltrados.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--color-secondary)', padding: '40px' }}>No se encontraron productos que coincidan con los criterios de búsqueda.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '25px'
                    }}>
                        {productosFiltrados.map(prod => {
                            const tieneDescuento = prod.PORCENTAJE_OFERTA > 0;
                            const precioOriginal = Number(prod.PRECIO_PROD);
                            const precioFinal = tieneDescuento 
                                ? precioOriginal * (1 - (prod.PORCENTAJE_OFERTA / 100))
                                : precioOriginal;

                            return (
                                <div key={prod.ID_PRODUCTO} style={{
                                    backgroundColor: 'var(--color-white)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--color-border)',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                                }}>
                                    <div 
                                        onClick={() => prod.IMAGEN_URL && setImagenModal(prod.IMAGEN_URL)}
                                        style={{ 
                                            height: '220px', 
                                            backgroundColor: '#f9f9f9', 
                                            display: 'flex', 
                                            justifyContent: 'center', 
                                            alignItems: 'center', 
                                            position: 'relative', 
                                            overflow: 'hidden',
                                            cursor: prod.IMAGEN_URL ? 'zoom-in' : 'default'
                                        }}
                                        title={prod.IMAGEN_URL ? "Click para ver imagen completa" : ""}
                                    >
                                        {prod.IMAGEN_URL ? (
                                            <img 
                                                src={prod.IMAGEN_URL} 
                                                alt={prod.NOMBRE_PROD} 
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '48px' }}>🎁</span>
                                        )}
                                        
                                        {tieneDescuento && (
                                            <span style={{
                                                position: 'absolute', top: '10px', left: '10px',
                                                backgroundColor: '#c62828', color: 'white', padding: '4px 8px',
                                                borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 10
                                            }}>
                                                -{prod.PORCENTAJE_OFERTA}% OFF
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '15px' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', color: 'var(--color-text)' }}>{prod.NOMBRE_PROD}</h3>
                                            <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-secondary)', height: '36px', overflow: 'hidden' }}>{prod.DESCRIPCION_PROD || 'Sin descripción disponible.'}</p>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--color-text)' }}>{formatearPrecio(precioFinal)}</span>
                                                {tieneDescuento && (
                                                    <span style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--color-secondary)' }}>{formatearPrecio(precioOriginal)}</span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: prod.STOCK <= 0 ? '#c62828' : 'var(--color-secondary)', marginTop: '5px' }}>
                                                {prod.STOCK <= 0 ? 'Sin stock disponible' : `Stock: ${prod.STOCK} unidades`}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => agregarItem && agregarItem(prod.ID_PRODUCTO)}
                                            disabled={prod.STOCK <= 0}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px', border: 'none',
                                                backgroundColor: prod.STOCK <= 0 ? '#ccc' : 'var(--color-primary)',
                                                color: prod.STOCK <= 0 ? '#666' : 'var(--color-text)',
                                                fontWeight: 'bold', cursor: prod.STOCK <= 0 ? 'not-allowed' : 'pointer'
                                            }}
                                        >
                                            {prod.STOCK <= 0 ? 'Agotado' : 'Añadir al Carrito'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 5. MODAL LIGHTBOX */}
            {imagenModal && (
                <div 
                    onClick={() => setImagenModal(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000,
                        cursor: 'pointer'
                    }}
                >
                    <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
                        <img 
                            src={imagenModal} 
                            alt="Vista Completa" 
                            style={{ 
                                maxWidth: '100%', 
                                maxHeight: '85vh', 
                                objectFit: 'contain', 
                                borderRadius: '8px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                            }} 
                        />
                        <button 
                            onClick={() => setImagenModal(null)}
                            style={{
                                position: 'absolute',
                                top: '-35px',
                                right: '0',
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            ✕ Cerrar Vista
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;