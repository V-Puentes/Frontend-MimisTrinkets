import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '15px 30px',
            backgroundColor: 'var(--color-white)',
            borderBottom: '2px solid var(--color-primary)',
            boxShadow: '0 2px 10px rgba(226, 132, 149, 0.1)'
        }}>
            <div>
                <Link to="/" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
                    Mimis Trinkets
                </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {isAuthenticated ? (
                    <>
                        <span style={{ marginRight: '20px', color: 'var(--color-text)', fontWeight: '500' }}>{user.nombre}</span>
                        {user.rolId === 2 && (
                            <Link to="/admin" style={{ color: 'var(--color-secondary)', textDecoration: 'none', marginRight: '20px', fontWeight: 'bold' }}>Panel Admin</Link>
                        )}
                        <button onClick={logout} style={{
                            padding: '8px 15px',
                            backgroundColor: 'var(--color-text)',
                            color: 'var(--color-white)',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}>
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <Link to="/login" style={{
                        color: 'var(--color-white)',
                        backgroundColor: 'var(--color-secondary)',
                        padding: '8px 15px',
                        borderRadius: '20px',
                        textDecoration: 'none',
                        fontWeight: 'bold'
                    }}>
                        Iniciar Sesión
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;