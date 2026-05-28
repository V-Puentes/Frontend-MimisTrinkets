import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoleId }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Cargando validación de seguridad...</div>;
    }

    if (!isAuthenticated) {
        // Si no está logueado, redirigir al inicio de sesión
        return <Navigate to="/login" replace />;
    }

    // Si la ruta exige un rol específico (ej. 2 para Administrador) y el usuario no lo tiene
    if (allowedRoleId && user.rolId !== allowedRoleId) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;