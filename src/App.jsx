import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CarritoProvider } from './context/CarritoProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';

// Componentes temporales restantes
const AdminTemporal = () => <h1 style={{ padding: '40px' }}>Panel de Administración</h1>;

function App() {
    return (
        <AuthProvider>
            <CarritoProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />

                        {/* Rutas exclusivas de Administrador */}
                        <Route element={<ProtectedRoute allowedRoleId={2} />}>
                            <Route path="/admin" element={<AdminTemporal />} />
                        </Route>

                        {/* Rutas protegidas genéricas (Clientes) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/mis-pedidos" element={<MisPedidos />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </CarritoProvider>
        </AuthProvider>
    );
}

export default App;