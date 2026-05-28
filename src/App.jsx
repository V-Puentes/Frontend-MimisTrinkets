import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CarritoProvider } from './context/CarritoProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';

// Componentes temporales restantes
const AdminTemporal = () => <h1 style={{ padding: '40px' }}>Panel de Administración</h1>;
const ClienteTemporal = () => <h1 style={{ padding: '40px' }}>Mis Pedidos</h1>;

function App() {
    return (
        <AuthProvider>
            <CarritoProvider> {/* Nuevo Wrapper */}
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/mis-pedidos" element={<ClienteTemporal />} />
                        </Route>
                        <Route element={<ProtectedRoute allowedRoleId={2} />}>
                            <Route path="/admin" element={<AdminTemporal />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CarritoProvider>
        </AuthProvider>
    );
}

export default App;