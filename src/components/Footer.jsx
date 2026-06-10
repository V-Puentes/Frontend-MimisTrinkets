const Footer = () => {
    return (
        <footer style={{
            backgroundColor: 'var(--color-text)',
            color: 'var(--color-white)',
            padding: '40px 30px',
            marginTop: '60px',
            borderTop: '3px solid var(--color-primary)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '30px'
            }}>
                <div style={{ flex: '1', minWidth: '250px' }}>
                    <h3 style={{ color: 'var(--color-primary)', marginTop: 0 }}>Mimis Trinkets</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc' }}>
                        Tu tienda de accesorios y coleccionables favoritos. Calidad y exclusividad en cada detalle.
                    </p>
                </div>
                                <div style={{ flex: '1', minWidth: '150px' }}>
                    <h4 style={{ marginTop: 0, borderBottom: '1px solid #555', paddingBottom: '5px' }}>Enlaces</h4>
                    <ul style={{ listStyle: 'none', padding: 0, fontSize: '14px', lineHeight: '2' }}>
                        <li><a href="/" style={{ color: '#ccc', textDecoration: 'none' }}>Inicio</a></li>
                        <li><a href="/contacto" style={{ color: '#ccc', textDecoration: 'none' }}>Contacto</a></li>
                        <li><a href="/mis-pedidos" style={{ color: '#ccc', textDecoration: 'none' }}>Mis Pedidos</a></li>
                        <li><a href="/ayuda" style={{ color: '#ccc', textDecoration: 'none', fontWeight: 'bold' }}>Centro de Ayuda / FAQ</a></li>
                    </ul>
                </div>
                <div style={{ flex: '1', minWidth: '200px' }}>
                    <h4 style={{ marginTop: 0, borderBottom: '1px solid #555', paddingBottom: '5px' }}>Soporte</h4>
                    <p style={{ fontSize: '14px', color: '#ccc', margin: '5px 0' }}>Horario: Lunes a Viernes 09:00 - 18:00</p>
                    <p style={{ fontSize: '14px', color: '#ccc', margin: '5px 0' }}>Email: soporte@mimistrinkets.cl</p>
                </div>
            </div>
            <div style={{
                textAlign: 'center',
                paddingTop: '20px',
                marginTop: '20px',
                borderTop: '1px solid #444',
                fontSize: '12px',
                color: '#999'
            }}>
                &copy; 2026 Mimis Trinkets. Todos los derechos reservados. Projecto de Portafolio.
            </div>
        </footer>
    );
};

export default Footer;