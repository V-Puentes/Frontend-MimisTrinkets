import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { CarritoProvider } from './context/CarritoProvider';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import MisPedidos from './pages/MisPedidos';
import Admin from './pages/Admin';
import Footer from './components/Footer';
import Perfil from './pages/Perfil';
import Contacto from './pages/Contacto';
import Ayuda from './pages/Ayuda';
import AdminDashboard from './pages/AdminDashboard';
import Register from './pages/Register';

function App() {
    return (
        <AuthProvider>
            <CarritoProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Rutas exclusivas de Administrador (Rol 2) */}
                        <Route element={<ProtectedRoute allowedRoleId={2} />}>
                            <Route path="/admin" element={<Admin />} />
                        </Route>

                        {/* Rutas protegidas genéricas (Clientes) */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/mis-pedidos" element={<MisPedidos />} />
                        </Route>
                        <Route element={<ProtectedRoute />}>
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/mis-pedidos" element={<MisPedidos />} />
                            <Route path="/perfil" element={<Perfil />} />
                        </Route>
                        <Route path="/contacto" element={<Contacto />} />
                        <Route path="/ayuda" element={<Ayuda />} />
                        <Route element={<ProtectedRoute adminOnly={true} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                        </Route>
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </CarritoProvider>
        </AuthProvider>
    );
}

export default App;