import { createContext, useContext } from 'react';

export const CarritoContext = createContext();

export const useCarrito = () => {
    return useContext(CarritoContext);
};