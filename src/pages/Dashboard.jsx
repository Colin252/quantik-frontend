import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
    const navigate = useNavigate();

    const menu = [
        { titulo: "Nueva Venta", ruta: "/ventas" },
        { titulo: "Clientes", ruta: "/clientes" },
        { titulo: "Proveedores", ruta: "/proveedores" },
        { titulo: "Productos", ruta: "/productos" },
        { titulo: "Ventas", ruta: "/ventas" },
        { titulo: "Facturas", ruta: "/facturas" },
        { titulo: "Transacciones", ruta: "/transacciones" },
        { titulo: "Ingresos", ruta: "/transacciones" },
        { titulo: "Gastos", ruta: "/transacciones" },
        { titulo: "Balance", ruta: "/balance" },
        { titulo: "Reportes", ruta: "/reportes" },
        { titulo: "Estadísticas", ruta: "/estadisticas" },
    ];

    return (
        <div className="dashboard-page">
            {/* 🎥 Video de fondo */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/espacio.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            <div className="dashboard-layout">
                {/* Sidebar */}
                <aside className="sidebar">
                    <h2 className="sidebar-title">Quantik</h2>
                    <ul>
                        {menu.map((item, i) => (
                            <li key={i} onClick={() => navigate(item.ruta)}>
                                {item.titulo}
                            </li>
                        ))}
                    </ul>

                    {/* 🔹 Solo queda cerrar sesión */}
                    <div className="dashboard-buttons">
                        <LogoutButton />
                    </div>
                </aside>

                {/* Contenido principal */}
                <main className="main-content">
                    <h1 className="welcome-title">
                        Bienvenido a <span>Quantik</span> 🪐
                    </h1>
                    <p className="welcome-subtitle">
                        Selecciona una opción del menú para comenzar tu gestión 🚀
                    </p>
                </main>
            </div>

            {/* Footer */}
            <footer className="footer">
                <p>Desarrollado por <strong>Helton Quiroz</strong></p>
            </footer>
        </div>
    );
}

export default Dashboard;
