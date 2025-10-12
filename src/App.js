import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Core pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Clientes from "./pages/Clientes";
import Productos from "./pages/Productos";
import Ventas from "./pages/Ventas";
import Transacciones from "./pages/Transacciones";
import Proveedores from "./pages/Proveedores";
import Facturas from "./pages/Facturas";
import RegistrarFactura from "./pages/RegistrarFactura";
import Reportes from "./pages/Reportes";
import Balance from "./pages/Balance";
import Estadisticas from "./pages/Estadisticas";

// Movimientos
import VerMovimientos from "./pages/VerMovimientos";
import AgregarMovimiento from "./pages/AgregarMovimiento";
import EditarMovimiento from "./pages/EditarMovimiento";
import EliminarMovimiento from "./pages/EliminarMovimiento";
import ResumenMovimientos from "./pages/ResumenMovimientos";

// Seguridad
import PrivateRoute from "./components/PrivateRoute";

function App() {
    const isAuthenticated = !!localStorage.getItem("token"); // 🔐 Verifica si hay token

    return (
        <Router>
            <Routes>
                {/* Core */}
                <Route
                    path="/"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" />   // 👉 Si hay sesión, no vuelve al login
                            : <Login />
                    }
                />
                <Route
                    path="/register"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" />   // 👉 Si ya hay sesión, tampoco entra al register
                            : <Register />
                    }
                />

                {/* Protegidas */}
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
                <Route path="/productos" element={<PrivateRoute><Productos /></PrivateRoute>} />
                <Route path="/ventas" element={<PrivateRoute><Ventas /></PrivateRoute>} />
                <Route path="/transacciones" element={<PrivateRoute><Transacciones /></PrivateRoute>} />
                <Route path="/proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} />
                <Route path="/facturas" element={<PrivateRoute><Facturas /></PrivateRoute>} />
                <Route path="/registrar-factura" element={<PrivateRoute><RegistrarFactura /></PrivateRoute>} />
                <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
                <Route path="/balance" element={<PrivateRoute><Balance /></PrivateRoute>} />
                <Route path="/estadisticas" element={<PrivateRoute><Estadisticas /></PrivateRoute>} />

                {/* Movimientos */}
                <Route path="/ver-movimientos" element={<PrivateRoute><VerMovimientos /></PrivateRoute>} />
                <Route path="/agregar-movimiento" element={<PrivateRoute><AgregarMovimiento /></PrivateRoute>} />
                <Route path="/editar-movimiento" element={<PrivateRoute><EditarMovimiento /></PrivateRoute>} />
                <Route path="/eliminar-movimiento" element={<PrivateRoute><EliminarMovimiento /></PrivateRoute>} />
                <Route path="/resumen-movimientos" element={<PrivateRoute><ResumenMovimientos /></PrivateRoute>} />

                {/* Default: si no encuentra ruta */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
