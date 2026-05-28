import { createContext, useContext } from 'react';

// 1. Se crea el contexto
export const AuthContext = createContext();

// 2. Se exporta el Hook personalizado
export const useAuth = () => {
    return useContext(AuthContext);
};