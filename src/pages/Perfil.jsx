import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { chileData } from '../utils/chileData';
import api from '../services/api';

const Perfil = () => {
    // Se asume que loginExitoso o actualizarUsuarioIniciado es la función del AuthContext 
    // que sobreescribe los datos del usuario en el estado global y localStorage.
    const { user, verificarAutenticacion, loginExitoso } = useAuth();
    
    const [loading, setLoading] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

    // Estados locales del formulario
    const [nombre, setNombre] = useState('');
    const [rut, setRut] = useState('');
    const [email, setEmail] = useState('');
    const [region, setRegion] = useState('');
    const [comuna, setComuna] = useState('');
    const [calleDetalle, setCalleDetalle] = useState('');
    const [comunasDisponibles, setComunasDisponibles] = useState([]);

    // Función centralizada para mapear los datos del contexto al estado local
    const cargarDatosDesdeContexto = () => {
        if (user) {
            setNombre(user.nombre || user.NOMBRE || '');
            setRut(user.rut || user.RUT || '');
            setEmail(user.email || user.EMAIL || '');

            const direccionGuardada = user.direccion || user.DIRECCION;
            if (direccionGuardada && direccionGuardada.includes(',')) {
                const partes = direccionGuardada.split(',').map(p => p.trim());
                if (partes.length >= 3) {
                    setCalleDetalle(partes[0]);
                    setRegion(partes[2]);
                    const regionEncontrada = chileData.find(item => item.region === partes[2]);
                    if (regionEncontrada) {
                        setComunasDisponibles(regionEncontrada.comunas);
                        setComuna(partes[1]);
                    }
                } else {
                    setCalleDetalle(direccionGuardada);
                }
            } else if (direccionGuardada) {
                setCalleDetalle(direccionGuardada);
            }
        }
    };

    // Cargar al montar el componente o cuando el usuario cambie
    useEffect(() => {
        cargarDatosDesdeContexto();
    }, [user]);

    const handleRegionChange = (e) => {
        const nuevaRegion = e.target.value;
        setRegion(nuevaRegion);
        const regionEncontrada = chileData.find(item => item.region === nuevaRegion);
        if (regionEncontrada) {
            setComunasDisponibles(regionEncontrada.comunas);
        } else {
            setComunasDisponibles([]);
        }
        setComuna('');
    };

    const handleCancelar = () => {
        cargarDatosDesdeContexto();
        setModoEdicion(false);
        setMensaje({ texto: '', tipo: '' });
    };

    const handleActualizarDatos = async (e) => {
        e.preventDefault();
        if (!nombre.trim() || !rut.trim() || !region || !comuna || !calleDetalle.trim()) {
            setMensaje({ texto: 'Por favor, complete todos los campos obligatorios.', tipo: 'error' });
            return;
        }

        setLoading(true);
        setMensaje({ texto: '', tipo: '' });
        const direccionCompleta = `${calleDetalle.trim()}, ${comuna}, ${region}`;

        try {
            const response = await api.put('/usuarios/perfil', {
                NOMBRE: nombre,
                RUT: rut,
                DIRECCION: direccionCompleta
            });

            // Extraer el token actualizado y los datos del usuario devueltos por el backend
            const { token, usuario } = response.data;

            if (token) {
                // Almacenar físicamente en el almacenamiento local para la próxima recarga
                localStorage.setItem('token', token);
                
                // Sincronizar el estado de React de forma inmediata con el mismo formato del Login
                if (loginExitoso) {
                    loginExitoso(usuario, token);
                }
            }

            if (verificarAutenticacion) await verificarAutenticacion();

            setMensaje({ texto: 'Perfil actualizado correctamente.', tipo: 'exito' });
            setModoEdicion(false);
        } catch (err) {
            console.error(err);
            setMensaje({ texto: err.response?.data?.message || 'Error al actualizar los datos.', tipo: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px', minHeight: '70vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'var(--color-text)', margin: 0 }}>Mi Cuenta</h1>
                {!modoEdicion && (
                    <button 
                        onClick={() => setModoEdicion(true)}
                        style={{ padding: '10px 20px', backgroundColor: 'var(--color-primary)', color: 'var(--color-text)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ⚙️ Editar Datos
                    </button>
                )}
            </div>

            <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                
                {mensaje.texto && (
                    <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', fontWeight: 'bold', backgroundColor: mensaje.tipo === 'error' ? '#fde8e8' : '#e1f5fe', color: mensaje.tipo === 'error' ? '#c62828' : '#0288d1' }}>
                        {mensaje.texto}
                    </div>
                )}

                {!modoEdicion ? (
                    /* VISTA FIJA DE DATOS (MODO LECTURA) */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                            <div>
                                <h5 style={{ margin: '0 0 5px 0', color: 'var(--color-secondary)', fontSize: '13px' }}>Nombre Completo</h5>
                                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: 'var(--color-text)' }}>{nombre || 'No registrado'}</p>
                            </div>
                            <div>
                                <h5 style={{ margin: '0 0 5px 0', color: 'var(--color-secondary)', fontSize: '13px' }}>RUT</h5>
                                <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: 'var(--color-text)' }}>{rut || 'No registrado'}</p>
                            </div>
                        </div>

                        <div>
                            <h5 style={{ margin: '0 0 5px 0', color: 'var(--color-secondary)', fontSize: '13px' }}>Correo Electrónico</h5>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: 'var(--color-text)' }}>{email}</p>
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />

                        <div>
                            <h5 style={{ margin: '0 0 5px 0', color: 'var(--color-secondary)', fontSize: '13px' }}>Dirección de Despacho Fija</h5>
                            <p style={{ margin: 0, fontSize: '16px', fontWeight: '500', color: 'var(--color-text)', lineHeight: '1.5' }}>
                                {calleDetalle ? `${calleDetalle}, ${comuna}, ${region}` : 'No hay una dirección registrada aún.'}
                            </p>
                        </div>
                    </div>
                ) : (
                    /* FORMULARIO ACTIVO (MODO EDICIÓN) */
                    <form onSubmit={handleActualizarDatos} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Nombre Completo *</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                            </div>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>RUT * <span style={{ fontWeight: 'normal', color: 'var(--color-secondary)', fontSize: '12px' }}>(con puntos y guión)</span></label>
                                <input type="text" value={rut} onChange={(e) => setRut(e.target.value)} placeholder="12.345.678-K" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: 'var(--color-secondary)' }}>Correo Electrónico (No modificable)</label>
                            <input type="email" value={email} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', cursor: 'not-allowed', boxSizing: 'border-box' }} />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '10px 0' }} />
                        <h4 style={{ margin: 0, color: 'var(--color-text)' }}>Modificar Dirección</h4>

                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Región *</label>
                                <select value={region} onChange={handleRegionChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required>
                                    <option value="">Seleccione Región...</option>
                                    {chileData.map((item, idx) => (
                                        <option key={idx} value={item.region}>{item.region}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{ flex: 1, minWidth: '250px' }}>
                                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Comuna *</label>
                                <select value={comuna} onChange={(e) => setComuna(e.target.value)} disabled={comunasDisponibles.length === 0} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box', backgroundColor: comunasDisponibles.length === 0 ? 'var(--color-bg)' : 'var(--color-white)' }} required>
                                    <option value="">Seleccione Comuna...</option>
                                    {comunasDisponibles.map((com, idx) => (
                                        <option key={idx} value={com}>{com}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Calle, Número, Departamento/Casa *</label>
                            <input type="text" placeholder="Ej: Avenida Concha y Toro 1340, Depto 402" value={calleDetalle} onChange={(e) => setCalleDetalle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                            <button type="button" onClick={handleCancelar} style={{ padding: '12px 20px', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={loading} style={{ padding: '12px 30px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-white)', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Perfil;