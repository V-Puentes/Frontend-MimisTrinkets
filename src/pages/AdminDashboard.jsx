import { useState, useEffect } from 'react';
import { obtenerMisPedidos } from '../services/pedidoService'; 
import { obtenerCategorias, obtenerProductos } from '../services/productoService';
import { crearCategoria, actualizarCategoria, eliminarCategoria } from '../services/adminService';

const AdminDashboard = () => {
    // Control de navegación jerárquica del panel de control
    const [seccionActiva, setSeccionActiva] = useState('REPORTE'); // 'REPORTE', 'CATEGORIAS', 'PRODUCTOS'

    // Estados de datos generales
    const [pedidos, setPedidos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para el Mantenimiento de Categorías
    const [nuevaCatNombre, setNuevaCatNombre] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [editCatNombre, setEditCatNombre] = useState('');
    const [crudMensaje, setCrudMensaje] = useState({ texto: '', tipo: '' });

    // Métricas financieras calculadas de la base de datos
    const [metricas, setMetricas] = useState({
        ventasTotales: 0,
        subtotalNeto: 0,
        ivaAcumulado: 0,
        enviosTotales: 0,
        montoFinal: 0
    });

    const cargarDatosAdmin = async () => {
        try {
            setLoading(true);
            const [pedidosData, categoriasData, productosData] = await Promise.all([
                obtenerMisPedidos(),
                obtenerCategorias(),
                obtenerProductos()
            ]);
            
            setPedidos(pedidosData);
            setCategorias(categoriasData);
            setProductos(productosData);

            // Sumatorias contables exactas del flujo de caja
            let totalNeto = 0;
            let totalIva = 0;
            let totalEnvio = 0;

            pedidosData.forEach(p => {
                totalNeto += Number(p.SUBTOTAL || 0);
                totalIva += Number(p.VALOR_IVA || 0);
                totalEnvio += 2000; 
            });

            setMetricas({
                ventasTotales: pedidosData.length,
                subtotalNeto: totalNeto,
                ivaAcumulado: totalIva,
                enviosTotales: totalEnvio,
                montoFinal: totalNeto + totalIva + totalEnvio
            });
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Error al compilar la información de auditoría interna.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosAdmin();
    }, []);

    const formatearPrecio = (precio) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
    };

    // Controladores CRUD: Categorías
    const handleCrearCategoria = async (e) => {
        e.preventDefault();
        if (!nuevaCatNombre.trim()) return;
        try {
            await crearCategoria({ NOMBRE_CAT: nuevaCatNombre.trim() });
            setNuevaCatNombre('');
            setCrudMensaje({ texto: 'Categoría creada con éxito.', tipo: 'exito' });
            const cats = await obtenerCategorias();
            setCategorias(cats);
        } catch (err) {
            setCrudMensaje({ texto: 'Error al registrar la categoría.', tipo: 'error' });
        }
    };

    const handleIniciarEdicion = (cat) => {
        setEditandoId(cat.ID_CATEGORIA);
        setEditCatNombre(cat.NOMBRE_CAT);
    };

    const handleGuardarEdicion = async (id) => {
        if (!editCatNombre.trim()) return;
        try {
            await actualizarCategoria(id, { NOMBRE_CAT: editCatNombre.trim() });
            setEditandoId(null);
            setCrudMensaje({ texto: 'Categoría modificada con éxito.', tipo: 'exito' });
            const cats = await obtenerCategorias();
            setCategorias(cats);
        } catch (err) {
            setCrudMensaje({ texto: 'Error al actualizar el registro.', tipo: 'error' });
        }
    };

    const handleEliminarCategoria = async (id) => {
        if (!window.confirm('¿Confirmar eliminación de la categoría? Los ítems del catálogo vinculados podrían quedar huérfanos.')) return;
        try {
            await eliminarCategoria(id);
            setCrudMensaje({ texto: 'Categoría eliminada del registro.', tipo: 'exito' });
            const cats = await obtenerCategorias();
            setCategorias(cats);
        } catch (err) {
            setCrudMensaje({ texto: 'Error. Restricción de llave foránea activa: remueva los productos asociados primero.', tipo: 'error' });
        }
    };

    if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--color-secondary)' }}>Cargando consola de administración...</div>;
    if (error) return <div style={{ padding: '80px', color: '#c62828', textAlign: 'center' }}>{error}</div>;

    const maxMonto = Math.max(metricas.subtotalNeto, metricas.ivaAcumulado, metricas.enviosTotales, 1);
    const pctNeto = (metricas.subtotalNeto / maxMonto) * 100;
    const pctIva = (metricas.ivaAcumulado / maxMonto) * 100;
    const pctEnvio = (metricas.enviosTotales / maxMonto) * 100;

    return (
        <div style={{ maxWidth: '1500px', margin: '40px auto', padding: '0 20px', minHeight: '80vh', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
            
            {/* CONSOLA DE ACCESO LATERAL UNIFICADA */}
            <div style={{ flex: '1', minWidth: '280px', backgroundColor: 'var(--color-white)', padding: '20px', borderRadius: '12px', border: '1px solid var(--color-border)', height: 'fit-content' }}>
                <h3 style={{ marginTop: 0, fontSize: '18px', color: 'var(--color-text)', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>Consola Operativa</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                    <button 
                        onClick={() => { setSeccionActiva('REPORTE'); setCrudMensaje({ texto: '', tipo: '' }); }}
                        style={{ width: '100%', padding: '12px', textAlign: 'left', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: seccionActiva === 'REPORTE' ? 'var(--color-primary)' : 'var(--color-bg)', color: 'var(--color-text)' }}
                    >
                        📊 Reporte Financiero
                    </button>
                    <button 
                        onClick={() => { setSeccionActiva('CATEGORIAS'); setCrudMensaje({ texto: '', tipo: '' }); }}
                        style={{ width: '100%', padding: '12px', textAlign: 'left', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: seccionActiva === 'CATEGORIAS' ? 'var(--color-primary)' : 'var(--color-bg)', color: 'var(--color-text)' }}
                    >
                        ✨ Mantenedor Categorías
                    </button>
                    <button 
                        onClick={() => { setSeccionActiva('PRODUCTOS'); setCrudMensaje({ texto: '', tipo: '' }); }}
                        style={{ width: '100%', padding: '12px', textAlign: 'left', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', backgroundColor: seccionActiva === 'PRODUCTOS' ? 'var(--color-primary)' : 'var(--color-bg)', color: 'var(--color-text)' }}
                    >
                        🎁 Inventario Productos ({productos.length})
                    </button>
                </div>
            </div>

            {/* CONTENEDOR DE SUBVISTAS ACTUADORAS */}
            <div style={{ flex: '3', minWidth: '600px' }}>
                
                {seccionActiva === 'REPORTE' && (
                    /* SUBVISTA 1: ANALÍTICA FINANCIERA */
                    <div>
                        <h2 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '25px' }}>Auditoría y Flujo de Caja</h2>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)', fontSize: '14px' }}>Órdenes Totales</h5>
                                <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: 'var(--color-text)' }}>{metricas.ventasTotales} uds</p>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)', fontSize: '14px' }}>Capital Neto</h5>
                                <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: 'var(--color-text)' }}>{formatearPrecio(metricas.subtotalNeto)}</p>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)', fontSize: '14px' }}>IVA Retenido</h5>
                                <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#e65100' }}>{formatearPrecio(metricas.ivaAcumulado)}</p>
                            </div>
                            <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                                <h5 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)', fontSize: '14px' }}>Caja Bruta</h5>
                                <p style={{ margin: 0, fontSize: '26px', fontWeight: 'bold', color: '#2e7d32' }}>{formatearPrecio(metricas.montoFinal)}</p>
                            </div>
                        </div>

                        <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '25px', color: 'var(--color-text)' }}>Distribución de Ingresos</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}><span>Capital Neto Comercial</span><strong>{formatearPrecio(metricas.subtotalNeto)}</strong></div>
                                    <div style={{ width: '100%', height: '24px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${pctNeto}%`, height: '100%', backgroundColor: '#fbc5d0' }}></div></div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}><span>IVA 19%</span><strong>{formatearPrecio(metricas.ivaAcumulado)}</strong></div>
                                    <div style={{ width: '100%', height: '24px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${pctIva}%`, height: '100%', backgroundColor: '#ffb74d' }}></div></div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}><span>Logística Despacho</span><strong>{formatearPrecio(metricas.enviosTotales)}</strong></div>
                                    <div style={{ width: '100%', height: '24px', backgroundColor: 'var(--color-bg)', borderRadius: '6px', overflow: 'hidden' }}><div style={{ width: `${pctEnvio}%`, height: '100%', backgroundColor: '#81c784' }}></div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {seccionActiva === 'CATEGORIAS' && (
                    /* SUBVISTA 2: MANTENEDOR CRUD DE CATEGORÍAS */
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '20px' }}>Control de Categorías</h2>
                        
                        {crudMensaje.texto && (
                            <div style={{ padding: '10px', marginBottom: '20px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: crudMensaje.tipo === 'error' ? '#fde8e8' : '#e1f5fe', color: crudMensaje.tipo === 'error' ? '#c62828' : '#0288d1' }}>
                                {crudMensaje.texto}
                            </div>
                        )}

                        <form onSubmit={handleCrearCategoria} style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                            <input 
                                type="text" 
                                placeholder="Nombre de la nueva categoría" 
                                value={nuevaCatNombre} 
                                onChange={(e) => setNuevaCatNombre(e.target.value)} 
                                style={{ flex: '1', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }} 
                                required 
                            />
                            <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-white)', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                ➕ Añadir
                            </button>
                        </form>

                        <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px' }}>ID</th>
                                        <th style={{ padding: '12px 15px' }}>Nombre Taxonómico</th>
                                        <th style={{ padding: '12px 15px', textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categorias.map(cat => (
                                        <tr key={cat.ID_CATEGORIA} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '12px 15px', fontWeight: 'bold', color: 'var(--color-secondary)' }}>#{cat.ID_CATEGORIA}</td>
                                            <td style={{ padding: '12px 15px' }}>
                                                {editandoId === cat.ID_CATEGORIA ? (
                                                    <input 
                                                        type="text" 
                                                        value={editCatNombre} 
                                                        onChange={(e) => setEditCatNombre(e.target.value)} 
                                                        style={{ padding: '6px', borderRadius: '4px', border: '1px solid var(--color-secondary)', width: '80%' }} 
                                                    />
                                                ) : (
                                                    cat.NOMBRE_CAT
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                                                {editandoId === cat.ID_CATEGORIA ? (
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleGuardarEdicion(cat.ID_CATEGORIA)} style={{ padding: '5px 10px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Guardar</button>
                                                        <button onClick={() => setEditandoId(null)} style={{ padding: '5px 10px', backgroundColor: '#757575', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancelar</button>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                        <button onClick={() => handleIniciarEdicion(cat)} style={{ padding: '5px 10px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: '4px', cursor: 'pointer' }}>✏️ Editar</button>
                                                        <button onClick={() => handleEliminarCategoria(cat.ID_CATEGORIA)} style={{ padding: '5px 10px', backgroundColor: '#fde8e8', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>🗑️ Borrar</button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {seccionActiva === 'PRODUCTOS' && (
                    /* SUBVISTA 3: RESUMEN DE INVENTARIO DEL CATÁLOGO */
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '20px' }}>Existencias en Catálogo</h2>
                        
                        <div style={{ border: '1px solid var(--color-border)', borderRadius: '8px', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
                                    <tr>
                                        <th style={{ padding: '12px 15px' }}>Código</th>
                                        <th style={{ padding: '12px 15px' }}>Producto</th>
                                        <th style={{ padding: '12px 15px' }}>Precio Base</th>
                                        <th style={{ padding: '12px 15px' }}>Stock Actual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map(prod => (
                                        <tr key={prod.ID_PRODUCTO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>#{prod.ID_PRODUCTO}</td>
                                            <td style={{ padding: '12px 15px' }}>{prod.NOMBRE_PROD}</td>
                                            <td style={{ padding: '12px 15px' }}>{formatearPrecio(prod.PRECIO_PROD)}</td>
                                            <td style={{ padding: '12px 15px', color: prod.STOCK <= 0 ? '#c62828' : 'var(--color-text)', fontWeight: prod.STOCK <= 0 ? 'bold' : 'normal' }}>
                                                {prod.STOCK <= 0 ? 'Agotado (0)' : `${prod.STOCK} unidades`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;