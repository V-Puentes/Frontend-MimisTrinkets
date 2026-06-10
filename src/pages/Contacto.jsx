import { useState } from 'react';

const Contacto = () => {
    const [formData, setFormData] = useState({ nombre: '', email: '', asunto: '', mensaje: '' });
    const [enviado, setEnviado] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Lógica de simulación de envío de correspondencia
        console.log('Formulario de contacto recibido:', formData);
        setEnviado(true);
        setFormData({ nombre: '', email: '', asunto: '', mensaje: '' });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', minHeight: '80vh' }}>
            <h1 style={{ color: 'var(--color-text)', marginBottom: '30px', textAlign: 'center' }}>Contacto</h1>
            
            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                {/* Formulario de Mensajería */}
                <div style={{ flex: '1', minWidth: '300px', backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                    <h3 style={{ marginTop: 0, color: 'var(--color-secondary)' }}>Envíanos un Mensaje</h3>
                    
                    {enviado && (
                        <div style={{ padding: '12px', marginBottom: '20px', backgroundColor: '#e1f5fe', color: '#0288d1', borderRadius: '6px', fontWeight: 'bold' }}>
                            ¡Gracias por escribirnos! Tu mensaje ha sido recibido y nos pondremos en contacto a la brevedad.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Nombre</label>
                            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Correo Electrónico</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Asunto</label>
                            <input type="text" name="asunto" value={formData.asunto} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box' }} required />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>Mensaje</label>
                            <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows="5" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)', boxSizing: 'border-box', resize: 'vertical' }} required></textarea>
                        </div>
                        <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--color-secondary)', color: 'var(--color-white)', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px' }}>
                            Enviar Mensaje
                        </button>
                    </form>
                </div>

                {/* Información Corporativa y Mapa de Ubicación */}
                <div style={{ flex: '1', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ backgroundColor: 'var(--color-white)', padding: '30px', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
                        <h3 style={{ marginTop: 0, color: 'var(--color-secondary)' }}>Ubicación y Canales</h3>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Dirección:</strong> Concha y Toro 1340, Puente Alto, Región Metropolitana, Chile.</p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Horario de Atención:</strong> Lunes a Viernes de 09:00 a 18:00 hrs.</p>
                        <p style={{ margin: '8px 0', fontSize: '15px' }}><strong>Soporte Técnico:</strong> soporte@mimistrinkets.cl</p>
                    </div>

                    <div style={{ flex: 1, minHeight: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
                    <iframe 
                        title="Mapa de ubicación Mimis Trinkets"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.5855099238385!2d-70.5816972!3d-33.616036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d7e5ccdf7e77%3A0x64426569ebf4244b!2sAv.%20Concha%20y%20Toro%201340%2C%20Puente%20Alto%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses-419!2scl!4v1718035000000!5m2!1ses-419!2scl"
                        width="100%" 
                        height="100%" 
                        style={{ border: 0, minHeight: '350px' }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Contacto;