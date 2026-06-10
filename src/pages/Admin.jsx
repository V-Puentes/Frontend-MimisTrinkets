import { useState, useEffect } from 'react';
import { obtenerProductos, eliminarProducto, obtenerCategorias, obtenerFranquicias, crearProducto, actualizarProducto } from '../services/productoService';
import { obtenerTodosLosPedidos, actualizarEstadoPedido } from '../services/pedidoService';
import { obtenerDatosInventario, descargarInventarioExcel, obtenerDatosVentas, descargarVentasPDF } from '../services/reporteService';

const Admin = () => {
    const [tabActiva, setTabActiva] = useState('productos'); 
    const [productos, setProductos] = useState([]);
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados del Mantenedor de Productos
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoIdEditar, setProductoIdEditar] = useState(null);
    const [formData, setFormData] = useState({
        NOMBRE_PROD: '', DESCRIPCION_PROD: '', PRECIO_PROD: '',
        PORCENTAJE_OFERTA: 0, STOCK: '', IMAGEN_URL: '',
        CATEGORIA_ID: '', FRANQUICIA_ID: ''
    });
    const [categorias, setCategorias] = useState([]);
    const [franquicias, setFranquicias] = useState([]);

    // Estados del Módulo de Reportes
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [limiteStock, setLimiteStock] = useState('10');
    const [reporteVentas, setReporteVentas] = useState([]);
    const [reporteStock, setReporteStock] = useState([]);
    const [loadingReporte, setLoadingReporte] = useState(false);

    const cargarDatosPanel = async () => {
        setLoading(true);
        try {
            if (tabActiva === 'productos') {
                const [prodData, catData, franqData] = await Promise.all([
                    obtenerProductos(), obtenerCategorias(), obtenerFranquicias()
                ]);
                setProductos(prodData);
                setCategorias(catData);
                setFranquicias(franqData);
            } else if (tabActiva === 'pedidos') {
                const pedidosData = await obtenerTodosLosPedidos();
                setPedidos(pedidosData);
            }
        } catch (err) {
            console.error(err);
            setError('Error al cargar la información del panel administrativo.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarDatosPanel();
    }, [tabActiva]);

    // Funciones de Reportes (Filtros en pantalla y descargas)
    const handleConsultarVentas = async () => {
        if (!fechaInicio || !fechaFin) return alert('Seleccione ambas fechas.');
        setLoadingReporte(true);
        try {
            const datos = await obtenerDatosVentas(fechaInicio, fechaFin);
            setReporteVentas(datos);
        } catch (err) {
            console.error(err);
            alert('Error al consultar datos de ventas.');
        } finally {
            setLoadingReporte(false);
        }
    };

    const handleDescargarVentasPDF = async () => {
        if (!fechaInicio || !fechaFin) return alert('Seleccione un rango de fechas válido.');
        try {
            const blob = await descargarVentasPDF(fechaInicio, fechaFin);
            const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_Ventas_${fechaInicio}_al_${fechaFin}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Error al descargar el PDF.');
        }
    };

    const handleConsultarStock = async () => {
        setLoadingReporte(true);
        try {
            const datos = await obtenerDatosInventario(limiteStock);
            setReporteStock(datos);
        } catch (err) {
            console.error(err);
            alert('Error al consultar inventario.');
        } finally {
            setLoadingReporte(false);
        }
    };

    const handleDescargarStockExcel = async () => {
        try {
            const blob = await descargarInventarioExcel(limiteStock);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `Reporte_Inventario_Stock_${limiteStock}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            alert('Error al descargar el archivo Excel.');
        }
    };

    // Manejadores del Mantenedor de Productos
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            cargarDatosPanel();
        } catch (err) {
            console.error(err);
            alert('Error al guardar el producto.');
        }
    };

    const handleEliminarProducto = async (id) => {
        if (!window.confirm('¿Confirmar eliminación de este producto?')) return;
        try {
            await eliminarProducto(id);
            setProductos(productos.filter(p => p.ID_PRODUCTO !== id));
        } catch (err) {
            console.error(err);
            alert('No se pudo eliminar el producto.');
        }
    };

    const handleCambioEstado = async (pedidoId, nuevoEstadoId) => {
        try {
            await actualizarEstadoPedido(pedidoId, nuevoEstadoId);
            alert('Estado del pedido actualizado.');
            setPedidos(pedidos.map(p => p.ID_PEDIDO === pedidoId ? { ...p, ESTADO_ID: nuevoEstadoId } : p));
        } catch (err) {
            console.error(err);
            alert('Error al actualizar el estado.');
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

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel...</div>;
    if (error) return <div style={{ padding: '40px', color: '#c62828' }}>{error}</div>;

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '20px' }}>Panel de Control Administrativo</h1>
            
            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid var(--color-border)', paddingBottom: '10px' }}>
                <button onClick={() => setTabActiva('productos')} style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', border: 'none', backgroundColor: tabActiva === 'productos' ? 'var(--color-primary)' : 'transparent', color: tabActiva === 'productos' ? 'var(--color-white)' : 'var(--color-text)', borderRadius: '4px' }}>
                    Inventario de Productos
                </button>
                <button onClick={() => setTabActiva('pedidos')} style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', border: 'none', backgroundColor: tabActiva === 'pedidos' ? 'var(--color-primary)' : 'transparent', color: tabActiva === 'pedidos' ? 'var(--color-white)' : 'var(--color-text)', borderRadius: '4px' }}>
                    Control de Ventas y Pedidos
                </button>
                <button onClick={() => setTabActiva('reportes')} style={{ padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', border: 'none', backgroundColor: tabActiva === 'reportes' ? 'var(--color-primary)' : 'transparent', color: tabActiva === 'reportes' ? 'var(--color-white)' : 'var(--color-text)', borderRadius: '4px' }}>
                    Módulo de Reportes
                </button>
            </div>

            {/* TABLA DE PRODUCTOS */}
            {tabActiva === 'productos' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <button onClick={abrirModalNuevo} style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
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
                                    <th style={{ padding: '15px' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map(p => (
                                    <tr key={p.ID_PRODUCTO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '15px' }}>{p.ID_PRODUCTO}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{p.NOMBRE_PROD}</td>
                                        <td style={{ padding: '15px' }}>{formatearPrecio(p.PRECIO_PROD)}</td>
                                        <td style={{ padding: '15px' }}>{p.STOCK}</td>
                                        <td style={{ padding: '15px' }}>
                                            <button onClick={() => handleEditar(p)} style={{ marginRight: '10px', padding: '5px 10px', cursor: 'pointer' }}>Editar</button>
                                            <button onClick={() => handleEliminarProducto(p.ID_PRODUCTO)} style={{ padding: '5px 10px', backgroundColor: '#c62828', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* CONTROL DE PEDIDOS */}
            {tabActiva === 'pedidos' && (
                <div style={{ overflowX: 'auto', backgroundColor: 'var(--color-white)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-bg)', borderBottom: '2px solid var(--color-border)' }}>
                            <tr>
                                <th style={{ padding: '15px' }}>Pedido #</th>
                                <th style={{ padding: '15px' }}>Cliente</th>
                                <th style={{ padding: '15px' }}>Despacho</th>
                                <th style={{ padding: '15px' }}>Total</th>
                                <th style={{ padding: '15px' }}>Estado</th>
                                <th style={{ padding: '15px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pedidos.map(pedido => (
                                <tr key={pedido.ID_PEDIDO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{pedido.ID_PEDIDO}</td>
                                    <td style={{ padding: '15px' }}>{pedido.Usuario?.EMAIL}</td>
                                    <td style={{ padding: '15px' }}>{pedido.DIRECCION_ENVIO}</td>
                                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{formatearPrecio(pedido.TOTAL_CON_IVA)}</td>
                                    <td style={{ padding: '15px' }}>{pedido.EstadoPedido?.NOMBRE_ESTADO || pedido.ESTADO_ID}</td>
                                    <td style={{ padding: '15px' }}>
                                        <select value={pedido.ESTADO_ID} onChange={(e) => handleCambioEstado(pedido.ID_PEDIDO, Number(e.target.value))}>
                                            <option value={1}>Procesando</option>
                                            <option value={2}>Enviado</option>
                                            <option value={3}>Entregado</option>
                                            <option value={4}>Cancelado</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* SECCIÓN DE REPORTES INTERACTIVOS */}
            {tabActiva === 'reportes' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* REPORTE 1: VENTAS */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>1. Reporte de Ingresos y Ventas</h3>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Fecha Inicio</label>
                                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ padding: '8px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Fecha Fin</label>
                                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} style={{ padding: '8px' }} />
                            </div>
                            <button onClick={handleConsultarVentas} style={{ padding: '9px 15px', cursor: 'pointer', backgroundColor: 'var(--color-text)', color: 'var(--color-white)', border: 'none', borderRadius: '4px' }}>Ver en Pantalla</button>
                            <button onClick={handleDescargarVentasPDF} style={{ padding: '9px 15px', cursor: 'pointer', backgroundColor: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Exportar PDF</button>
                        </div>

                        {reporteVentas.length > 0 && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead style={{ backgroundColor: 'var(--color-bg)' }}>
                                    <tr>
                                        <th style={{ padding: '10px' }}>ID Pedido</th>
                                        <th style={{ padding: '10px' }}>Cliente</th>
                                        <th style={{ padding: '10px' }}>Fecha</th>
                                        <th style={{ padding: '10px' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteVentas.map(v => (
                                        <tr key={v.ID_PEDIDO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '10px' }}>{v.ID_PEDIDO}</td>
                                            <td style={{ padding: '10px' }}>{v.Usuario?.NOMBRE}</td>
                                            <td style={{ padding: '10px' }}>{new Date(v.FECHA_PEDIDO).toLocaleDateString()}</td>
                                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{formatearPrecio(v.TOTAL_CON_IVA)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* REPORTE 2: INVENTARIO / STOCK CRÍTICO */}
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '25px', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-text)' }}>2. Auditoría de Inventario y Stock Crítico</h3>
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Stock inferior o igual a:</label>
                                <input type="number" value={limiteStock} onChange={(e) => setLimiteStock(e.target.value)} style={{ padding: '8px', width: '100px' }} />
                            </div>
                            <button onClick={handleConsultarStock} style={{ padding: '9px 15px', cursor: 'pointer', backgroundColor: 'var(--color-text)', color: 'var(--color-white)', border: 'none', borderRadius: '4px' }}>Ver en Pantalla</button>
                            <button onClick={handleDescargarStockExcel} style={{ padding: '9px 15px', cursor: 'pointer', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Exportar XLS</button>
                        </div>

                        {reporteStock.length > 0 && (
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead style={{ backgroundColor: 'var(--color-bg)' }}>
                                    <tr>
                                        <th style={{ padding: '10px' }}>ID</th>
                                        <th style={{ padding: '10px' }}>Producto</th>
                                        <th style={{ padding: '10px' }}>Categoría</th>
                                        <th style={{ padding: '10px' }}>Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reporteStock.map(s => (
                                        <tr key={s.ID_PRODUCTO} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '10px' }}>{s.ID_PRODUCTO}</td>
                                            <td style={{ padding: '10px', fontWeight: 'bold' }}>{s.NOMBRE_PROD}</td>
                                            <td style={{ padding: '10px' }}>{s.Categorium?.NOMBRE_CAT}</td>
                                            <td style={{ padding: '10px', color: s.STOCK <= 3 ? '#c62828' : 'inherit', fontWeight: s.STOCK <= 3 ? 'bold' : 'normal' }}>{s.STOCK} u.</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL DE EDICIÓN / CREACIÓN */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2>{modoEdicion ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nombre *</label>
                                <input type="text" name="NOMBRE_PROD" value={formData.NOMBRE_PROD} onChange={handleInputChange} required style={{ width: '100%', padding: '10px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descripción</label>
                                <textarea name="DESCRIPCION_PROD" value={formData.DESCRIPCION_PROD} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px' }}></textarea>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Precio *</label>
                                    <input type="number" name="PRECIO_PROD" value={formData.PRECIO_PROD} onChange={handleInputChange} required min="0" style={{ width: '100%', padding: '10px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Stock *</label>
                                    <input type="number" name="STOCK" value={formData.STOCK} onChange={handleInputChange} required min="0" style={{ width: '100%', padding: '10px' }} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Categoría *</label>
                                    <select name="CATEGORIA_ID" value={formData.CATEGORIA_ID} onChange={handleInputChange} required style={{ width: '100%', padding: '10px' }}>
                                        <option value="">Seleccione...</option>
                                        {categorias.map(cat => <option key={cat.ID_CATEGORIA} value={cat.ID_CATEGORIA}>{cat.NOMBRE_CAT}</option>)}
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Franquicia *</label>
                                    <select name="FRANQUICIA_ID" value={formData.FRANQUICIA_ID} onChange={handleInputChange} required style={{ width: '100%', padding: '10px' }}>
                                        <option value="">Seleccione...</option>
                                        {franquicias.map(f => <option key={f.ID_FRANQUICIA} value={f.ID_FRANQUICIA}>{f.NOMBRE_FRANQ}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>% Oferta</label>
                                    <input type="number" name="PORCENTAJE_OFERTA" value={formData.PORCENTAJE_OFERTA} onChange={handleInputChange} min="0" max="100" style={{ width: '100%', padding: '10px' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>URL Imagen</label>
                                    <input type="text" name="IMAGEN_URL" value={formData.IMAGEN_URL} style={{ width: '100%', padding: '10px' }} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px' }}>Cancelar</button>
                                <button type="submit" style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'var(--color-white)', border: 'none', cursor: 'pointer' }}>Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;