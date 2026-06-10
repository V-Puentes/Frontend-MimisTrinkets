import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estado con los campos exactos que espera el backend
    const [formData, setFormData] = useState({
        RUT: '',
        NOMBRE: '',
        EMAIL: '',
        PASSWORD: '',
        FECHA_NACIMIENTO: '',
        DIRECCION: '' // Se inicializa vacío, el usuario lo completa en su perfil si desea despachar
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Se envía el ROL_ID por defecto como 2 (Cliente) para evitar elevación de privilegios
            await api.post('/usuarios/registro-publico', {
                ...formData,
                ROL_ID: 2 
            });

            alert('Cuenta creada exitosamente. Ya puedes iniciar sesión.');
            navigate('/login'); // Redirección síncrona al login
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al registrar el usuario. Verifique los datos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px', minHeight: '70vh' }}>
            <div style={{ backgroundColor: 'var(--color-white)', padding: '40px', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                <h2 style={{ color: 'var(--color-text)', marginTop: 0, marginBottom: '25px', textAlign: 'center' }}>Crear Cuenta</h2>

                {error && (
                    <div style={{ padding: '10px', marginBottom: '20px', backgroundColor: '#fde8e8', color: '#c62828', borderRadius: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nombre Completo *</label>
                        <input type="text" name="NOMBRE" value={formData.NOMBRE} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>RUT * <span style={{ fontWeight: 'normal', color: 'var(--color-secondary)', fontSize: '12px' }}>(con puntos y guión)</span></label>
                        <input type="text" name="RUT" value={formData.RUT} onChange={handleChange} placeholder="12.345.678-K" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Fecha de Nacimiento *</label>
                        <input type="date" name="FECHA_NACIMIENTO" value={formData.FECHA_NACIMIENTO} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Correo Electrónico *</label>
                        <input type="email" name="EMAIL" value={formData.EMAIL} onChange={handleChange} placeholder="ejemplo@correo.com" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Contraseña *</label>
                        <input type="password" name="PASSWORD" value={formData.PASSWORD} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-white)', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', marginTop: '10px' }}>
                        {loading ? 'Registrando Cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-secondary)' }}>
                    ¿Ya tienes una cuenta? <a href="/login" style={{ color: 'var(--color-text)', fontWeight: 'bold', textDecoration: 'none' }}>Inicia Sesión</a>
                </p>
            </div>
        </div>
    );
};

export default Register;