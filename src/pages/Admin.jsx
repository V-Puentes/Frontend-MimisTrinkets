import { useState, useEffect } from 'react';
import { obtenerProductos, eliminarProducto, obtenerCategorias, obtenerFranquicias } from '../services/productoService';

const Admin = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para el Modal y Formulario
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoIdEditar, setProductoIdEditar] = useState(null);
    const [formData, setFormData] = useState({
        NOMBRE_PROD: '',
        DESCRIPCION_PROD: '',
        PRECIO_PROD: '',
        PORCENTAJE_OFERTA: 0,
        STOCK: '',
        IMAGEN_URL: '',
        CATEGORIA_ID: '',
        FRANQUICIA_ID: ''
    });

    // Estados para los selectores relacionales
    const [categorias, setCategorias] = useState([]);
    const [franquicias, setFranquicias] = useState([]);

    // 1. Carga inicial de datos
    useEffect(() => {
        const cargarDatos = async () => {
        try {
            const [productosData, categoriasData, franquiciasData] = await Promise.all([
                obtenerProductos(),
                obtenerCategorias(),
                obtenerFranquicias()
            ]);
            setProductos(productosData);
            setCategorias(categoriasData);
            setFranquicias(franquiciasData);
        } catch (err) {
            console.error(err);
            setError('Error al cargar los datos del panel.');
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        cargarDatos();
    }, []);

    // 2. Funciones manejadoras del formulario y acciones
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.NOMBRE_PROD.trim() || !formData.PRECIO_PROD || !formData.STOCK || !formData.CATEGORIA_ID || !formData.FRANQUICIA_ID) {
            alert('Por favor, complete todos los campos obligatorios.');
            return;
        }

        if (Number(formData.PRECIO_PROD) < 0 || Number(formData.STOCK) < 0) {
            alert('El precio y el stock no pueden ser valores negativos.');
            return;
        }

        try {
            if (modoEdicion) {
                await actualizarProducto(productoIdEditar, formData);
                alert('Producto actualizado correctamente.');
            } else {
                await crearProducto(formData);
                alert('Producto creado correctamente.');
            }
            
            setIsModalOpen(false);
            setModoEdicion(false);
            await cargarDatos(); // Refresca la tabla sincrónicamente con la BD
        } catch (err) {
            console.error(err);
            alert(typeof err === 'string' ? err : 'Error al guardar el producto. Verifique los campos.');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Está seguro de eliminar este producto?')) return;

        try {
            await eliminarProducto(id);
            setProductos(productos.filter(p => p.ID_PRODUCTO !== id));
        } catch (err) {
            console.error(err);
            alert('Error al eliminar el producto. Verifique sus permisos.');
        }
    };
const handleEditar = (producto) => {
        setModoEdicion(true);
        setProductoIdEditar(producto.ID_PRODUCTO);
        setFormData({
            NOMBRE_PROD: producto.NOMBRE_PROD || '',
            DESCRIPCION_PROD: producto.DESCRIPCION_PROD || '',
            PRECIO_PROD: producto.PRECIO_PROD || '',
            PORCENTAJE_OFERTA: producto.PORCENTAJE_OFERTA || 0,
            STOCK: producto.STOCK || '',
            IMAGEN_URL: producto.IMAGEN_URL || '',
            CATEGORIA_ID: producto.CATEGORIA_ID || '',
            FRANQUICIA_ID: producto.FRANQUICIA_ID || ''
        });
        setIsModalOpen(true);
    };

    const abrirModalNuevo = () => {
        setModoEdicion(false);
        setProductoIdEditar(null);
        setFormData({
            NOMBRE_PROD: '', DESCRIPCION_PROD: '', PRECIO_PROD: '',
            PORCENTAJE_OFERTA: 0, STOCK: '', IMAGEN_URL: '',
            CATEGORIA_ID: '', FRANQUICIA_ID: ''
        });
        setIsModalOpen(true);
    };
    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    // 3. Renderizado de carga y errores
    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel...</div>;
    if (error) return <div style={{ padding: '40px', color: '#c62828' }}>{error}</div>;

    // 4. Renderizado principal
    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ color: 'var(--color-text)' }}>Gestión de Productos</h1>
                <button 
                    onClick={abrirModalNuevo}
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    + Nuevo Producto
                </button>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                        <tr>
                            <th style={{ padding: '15px' }}>ID</th>
                            <th style={{ padding: '15px' }}>Nombre</th>
                            <th style={{ padding: '15px' }}>Precio</th>
                            <th style={{ padding: '15px' }}>Stock</th>
                            <th style={{ padding: '15px' }}>Categoría</th>
                            <th style={{ padding: '15px' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map(producto => (
                            <tr key={producto.ID_PRODUCTO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '15px' }}>{producto.ID_PRODUCTO}</td>
                                <td style={{ padding: '15px', fontWeight: 'bold' }}>{producto.NOMBRE_PROD}</td>
                                <td style={{ padding: '15px' }}>{formatearPrecio(producto.PRECIO_PROD)}</td>
                                <td style={{ padding: '15px' }}>{producto.STOCK}</td>
                                <td style={{ padding: '15px' }}>{producto.Categorium?.NOMBRE_CAT || 'N/A'}</td>
                                <td style={{ padding: '15px' }}>
                                    <button style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                    <button onClick={() => handleEditar(producto)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {isModalOpen && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', 
                    alignItems: 'center', zIndex: 1000 
                }}>
                    <div style={{ 
                        backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '8px', 
                        width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }}>
                        <h2 style={{ marginTop: 0, color: 'var(--color-text)', borderBottom: '2px solid var(--color-bg)', paddingBottom: '10px' }}>
                            {modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}
                        </h2>
                        
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nombre del Producto *</label>
                                <input type="text" name="NOMBRE_PROD" value={formData.NOMBRE_PROD} onChange={handleInputChange} required 
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Descripción</label>
                                <textarea name="DESCRIPCION_PROD" value={formData.DESCRIPCION_PROD} onChange={handleInputChange} rows="3" 
                                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Precio *</label>
                                    <input type="number" name="PRECIO_PROD" value={formData.PRECIO_PROD} onChange={handleInputChange} required min="0"
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Stock *</label>
                                    <input type="number" name="STOCK" value={formData.STOCK} onChange={handleInputChange} required min="0"
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Categoría *</label>
                                    <select name="CATEGORIA_ID" value={formData.CATEGORIA_ID} onChange={handleInputChange} required 
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}>
                                        <option value="">Seleccione...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.ID_CATEGORIA} value={cat.ID_CATEGORIA}>{cat.NOMBRE_CAT}</option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Franquicia *</label>
                                    <select name="FRANQUICIA_ID" value={formData.FRANQUICIA_ID} onChange={handleInputChange} required 
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }}>
                                        <option value="">Seleccione...</option>
                                        {franquicias.map(franq => (
                                            <option key={franq.ID_FRANQUICIA} value={franq.ID_FRANQUICIA}>{franq.NOMBRE_FRANQ}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>% Oferta</label>
                                    <input type="number" name="PORCENTAJE_OFERTA" value={formData.PORCENTAJE_OFERTA} onChange={handleInputChange} min="0" max="100"
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>URL Imagen (Ej: 1.png)</label>
                                    <input type="text" name="IMAGEN_URL" value={formData.IMAGEN_URL} onChange={handleInputChange} 
                                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--color-bg)' }}>
                                <button type="button" onClick={() => { setIsModalOpen(false); setModoEdicion(false); }} 
                                    style={{ padding: '10px 20px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: '#f5f5f5', cursor: 'pointer', fontWeight: 'bold', color: '#333' }}>
                                    Cancelar
                                </button>
                                <button type="submit"
                                    style={{ padding: '10px 20px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;