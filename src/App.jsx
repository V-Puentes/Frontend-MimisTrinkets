import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';

// Componentes temporales
const LoginTemporal = () => <h1 style={{ padding: '40px' }}>Página de Login</h1>;
const AdminTemporal = () => <h1 style={{ padding: '40px' }}>Panel de Administración</h1>;
const ClienteTemporal = () => <h1 style={{ padding: '40px' }}>Mis Pedidos</h1>;

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Navbar />
                <Routes>
                    {/* Rutas Públicas */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LoginTemporal />} />

                    {/* Rutas Protegidas - Solo Usuarios Logueados */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/mis-pedidos" element={<ClienteTemporal />} />
                    </Route>

                    {/* Rutas Protegidas - Solo Administradores (rolId: 2) */}
                    <Route element={<ProtectedRoute allowedRoleId={2} />}>
                        <Route path="/admin" element={<AdminTemporal />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;