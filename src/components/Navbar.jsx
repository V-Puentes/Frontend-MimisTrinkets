import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import CarritoModal from './CarritoModal';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const { toggleModal, carrito } = useCarrito();

    // Conteo de ítems para el indicador visual
    const totalItems = carrito.DetalleCarritos?.reduce((sum, item) => sum + item.CANTIDAD, 0) || 0;

    return (
        <>
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                backgroundColor: 'var(--color-white)',
                borderBottom: '2px solid var(--color-primary)',
                boxShadow: '0 2px 10px rgba(226, 132, 149, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                {/* Logo Principal */}
                <div>
                    <Link to="/" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
                        Mimis Trinkets
                    </Link>
                </div>

                {/* Enlaces de Navegación Públicos */}
                <div style={{ display: 'flex', gap: '25px' }}>
                    <Link to="/" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>
                        Inicio
                    </Link>
                    <Link to="/contacto" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>
                        Contacto
                    </Link>
                </div>

                {/* Bloque de Usuario y Carrito */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    
                    {/* Botón del Carrito (Siempre disponible) */}
                    <button onClick={toggleModal} style={{ 
                        background: 'none', border: 'none', cursor: 'pointer', 
                        fontWeight: 'bold', color: 'var(--color-secondary)', fontSize: '16px', display: 'flex', alignItems: 'center' 
                    }}>
                        Carrito <span style={{ 
                            backgroundColor: 'var(--color-primary)', color: 'var(--color-text)', 
                            borderRadius: '50%', padding: '2px 8px', marginLeft: '5px', fontSize: '12px' 
                        }}>{totalItems}</span>
                    </button>

                    {isAuthenticated ? (
                        <>
                            {/* Enlaces exclusivos para clientes autenticados */}
                            <Link to="/mis-pedidos" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>
                                Mis Pedidos
                            </Link>
                            <Link to="/perfil" style={{ color: 'var(--color-text)', textDecoration: 'none', fontWeight: '500' }}>
                                Mi Cuenta
                            </Link>

                            {/* Enlace exclusivo para el Administrador (Rol 2) */}
                            {user?.rolId === 2 && (
                                <Link to="/admin" style={{ color: 'var(--color-secondary)', textDecoration: 'none', fontWeight: 'bold' }}>
                                    Panel Admin
                                </Link>
                            )}

                            <button onClick={logout} style={{ 
                                padding: '8px 15px', backgroundColor: 'var(--color-text)', color: 'var(--color-white)', 
                                border: 'none', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
                            }}>
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ 
                            color: 'var(--color-white)', backgroundColor: 'var(--color-secondary)',
                            padding: '8px 15px', borderRadius: '20px', textDecoration: 'none', fontWeight: 'bold'
                        }}>
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </nav>

            {/* Renderizado del Modal fuera del flujo del Navbar */}
            <CarritoModal />
        </>
    );
};

export default Navbar;