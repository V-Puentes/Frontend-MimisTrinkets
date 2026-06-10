import { useState } from 'react';

const Ayuda = () => {
    const [abiertos, setAbiertos] = useState({});

    const toggleFaq = (index) => {
        setAbiertos({ ...abiertos, [index]: !abiertos[index] });
    };

    const faqs = [
        {
            q: "¿Cuáles son los métodos de despacho disponibles?",
            a: "Realizamos envíos a domicilio a través de empresas de transporte asociadas en toda la Región Metropolitana y regiones seleccionadas. El costo base general de envío es de $2.000."
        },
        {
            q: "¿Cuánto tarda en llegar mi pedido?",
            a: "El tiempo de entrega estimado es de 2 a 5 días hábiles a contar desde la confirmación del pago de la orden de compra. Puedes revisar el estado de avance en la pestaña 'Mis Pedidos'."
        },
        {
            q: "¿Cómo puedo realizar el seguimiento de mi compra?",
            a: "Al iniciar sesión e ingresar a 'Mis Pedidos', verás el estado logístico actualizado en tiempo real por el equipo administrador (Procesando, Enviado o Entregado)."
        },
        {
            q: "¿Qué hago si mi producto presenta fallas?",
            a: "Dispones de una garantía legal para cambios o devoluciones escribiendo directamente a nuestro formulario de contacto adjuntando tu número de pedido dentro de los primeros 30 días."
        }
    ];

    return (
        <div style={{ maxWidth: '850px', margin: '40px auto', padding: '0 20px', minHeight: '75vh' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '10px', textAlign: 'center' }}>Centro de Ayuda</h1>
            <p style={{ textAlign: 'center', color: 'var(--color-secondary)', marginBottom: '40px' }}>Resuelve tus dudas operativas de forma rápida e inmediata</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {faqs.map((faq, idx) => (
                    <div 
                        key={idx} 
                        style={{ backgroundColor: 'var(--color-white)', borderRadius: '8px', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: '0 2px 6px rgba(0,0,0,0.01)' }}
                    >
                        {/* Fila del Título/Pregunta clickable */}
                        <div 
                            onClick={() => toggleFaq(idx)}
                            style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: 'var(--color-text)', userSelect: 'none', backgroundColor: abiertos[idx] ? 'var(--color-bg)' : 'transparent' }}
                        >
                            <span>{faq.q}</span>
                            <span style={{ transition: 'transform 0.2s', transform: abiertos[idx] ? 'rotate(180deg)' : 'none' }}>▼</span>
                        </div>
                        
                        {/* Bloque Colapsable de Respuesta */}
                        {abiertos[idx] && (
                            <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)', color: '#555', fontSize: '15px', lineHeight: '1.6', backgroundColor: 'var(--color-white)' }}>
                                {faq.a}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ayuda;