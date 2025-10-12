import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import LogoutButton from "../components/LogoutButton";

function Dashboard() {
    const navigate = useNavigate();
    const [fadeIn, setFadeIn] = useState(false);

    useEffect(() => {
        // 🔹 Activa el efecto de entrada suave
        const timer = setTimeout(() => setFadeIn(true), 100);
        return () => clearTimeout(timer);
    }, []);

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
        <div
            className={`dashboard-page ${fadeIn ? "fade-in" : ""}`}
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + '/dashboard.webp'})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            <div className="overlay"></div>

            <div className="dashboard-layout">
                {/* 🔹 Sidebar izquierdo */}
                <aside className="sidebar">
                    <h2 className="sidebar-title">Quantik</h2>
                    <ul>
                        {menu.map((item, i) => (
                            <li key={i} onClick={() => navigate(item.ruta)}>
                                {item.titulo}
                            </li>
                        ))}
                    </ul>

                    <div className="dashboard-buttons">
                        <LogoutButton />
                    </div>
                </aside>

                {/* 🔹 Contenido principal */}
                <main className="main-content">
                    <h1 className="welcome-title">
                        Bienvenido a <span>Quantik</span> 🪐
                    </h1>
                    <p className="welcome-subtitle">
                        Gestiona tus ventas, reportes y balances financieros en un solo lugar.
                    </p>
                </main>
            </div>

            {/* 🔹 Footer */}
            <footer className="footer">
                <p>
                    Desarrollado por <strong>Helton Quiroz</strong> — 2025 🚀
                </p>
            </footer>
        </div>
    );
}

export default Dashboard;
