import { useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    }, []);

    const login = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setUser(jwtDecode(newToken));
    };

    useEffect(() => {
        const initializeAuth = () => {
            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        console.warn('El token ha expirado.');
                        logout();
                    } else {
                        setUser(decoded);
                    }
                } catch (error) {
                    console.error('Error al decodificar el token:', error);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [token, logout]);

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};