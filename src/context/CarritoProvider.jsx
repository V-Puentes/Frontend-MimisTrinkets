import { useState, useEffect, useCallback } from 'react';
import { obtenerCarrito, agregarProductoCarrito, quitarProductoCarrito, restarProductoCarrito } from '../services/carritoService';
import { useAuth } from './AuthContext';
import { CarritoContext } from './CarritoContext';

export const CarritoProvider = ({ children }) => {
    const [carrito, setCarrito] = useState({ DetalleCarritos: [] });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const cargarCarrito = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await obtenerCarrito();
            setCarrito(data || { DetalleCarritos: [] });
        } catch (error) {
            console.error('Error en sincronización de carrito:', error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        let isMounted = true;

        const inicializarCarrito = async () => {
            if (isAuthenticated) {
                await cargarCarrito();
            } else {
                // Resolución asíncrona para evitar el error de setState síncrono (cascading renders)
                Promise.resolve().then(() => {
                    if (isMounted) setCarrito({ DetalleCarritos: [] });
                });
            }
        };

        inicializarCarrito();

        return () => {
            isMounted = false;
        };
    }, [isAuthenticated, cargarCarrito]);

    const agregarItem = async (productoId) => {
        if (!isAuthenticated) {
            alert('Debe iniciar sesión para agregar productos al carrito.');
            return;
        }
        try {
            await agregarProductoCarrito(productoId, 1);
            await cargarCarrito();
            setIsModalOpen(true);
        } catch (error) {
            console.error(error);
            alert('No se pudo agregar el producto.');
        }
    };

    const restarItem = async (productoId, detalleId, cantidadActual) => {
        try {
            if (cantidadActual <= 1) {
                // Si solo queda 1 unidad, se elimina el registro completo de la base de datos
                await quitarProductoCarrito(detalleId);
            } else {
                // Si hay más de 1, se llama al endpoint de resta
                await restarProductoCarrito(productoId);
            }
            await cargarCarrito(); // Sincronizar el estado con la base de datos
        } catch (error) {
            console.error(error);
        }
    };

    const quitarItem = async (detalleId) => {
        try {
            await quitarProductoCarrito(detalleId);
            await cargarCarrito();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    return (
        <CarritoContext.Provider value={{
            carrito,
            agregarItem,
            restarItem,
            quitarItem,
            isModalOpen,
            toggleModal,
            cargarCarrito
        }}>
            {children}
        </CarritoContext.Provider>
    );
};