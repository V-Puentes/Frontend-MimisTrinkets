import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoleId }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Verificando credenciales...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si la ruta requiere validación de rol, se aplica evaluación estricta
    if (allowedRoleId !== undefined) {
        // Se extrae el rol y se fuerza a Number para evitar fallos por "2" !== 2
        const rolActual = Number(user?.ROL_ID || user?.rolId);
        const rolEsperado = Number(allowedRoleId);

        // Bloque de diagnóstico (Revise la consola del navegador al intentar entrar a /admin)
        console.log('--- DIAGNÓSTICO DE SEGURIDAD ---');
        console.log('Datos del token decodificado (user):', user);
        console.log('Rol Actual del Usuario:', rolActual);
        console.log('Rol Requerido por la Ruta:', rolEsperado);

        if (rolActual !== rolEsperado) {
            console.warn('Acceso denegado. Redirigiendo al catálogo.');
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;