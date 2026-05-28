import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUsuario } from '../services/authService';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await loginUsuario({ EMAIL: email, PASSWORD: password });
            login(data.token);
            navigate('/'); // Redirección al catálogo tras el login exitoso
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '80vh' 
        }}>
            <div style={{ 
                backgroundColor: 'var(--color-white)', 
                padding: '40px', 
                borderRadius: '15px', 
                boxShadow: '0 8px 20px rgba(226, 132, 149, 0.15)',
                width: '100%',
                maxWidth: '400px',
                border: '1px solid var(--color-border)'
            }}>
                <h2 style={{ textAlign: 'center', color: 'var(--color-text)', marginBottom: '25px' }}>
                    Iniciar Sesión
                </h2>

                {error && (
                    <div style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        marginBottom: '20px',
                        textAlign: 'center',
                        fontSize: '14px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '14px' }}>
                            Correo Electrónico
                        </label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                border: '1px solid var(--color-border)',
                                outline: 'none',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text)'
                            }} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--color-secondary)', fontWeight: 'bold', fontSize: '14px' }}>
                            Contraseña
                        </label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ 
                                width: '100%', 
                                padding: '12px', 
                                borderRadius: '8px', 
                                border: '1px solid var(--color-border)',
                                outline: 'none',
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text)'
                            }} 
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '12px', 
                            backgroundColor: 'var(--color-primary)', 
                            color: 'var(--color-text)', 
                            border: 'none', 
                            borderRadius: '25px', 
                            fontWeight: 'bold', 
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginTop: '10px',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Verificando...' : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;