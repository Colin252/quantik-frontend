import { Link } from "react-router-dom";
import "./Layout.css";

function Layout({ children }) {
    return (
        <div>
            {/* Barra de navegación */}
            <nav className="navbar">
                <ul>
                    <li><Link to="/dashboard">Dashboard</Link></li>
                    <li><Link to="/clientes">Clientes</Link></li>
                    <li><Link to="/usuarios">Usuarios</Link></li>
                    <li><Link to="/ventas">Ventas</Link></li>
                    <li><Link to="/productos">Productos</Link></li>
                    <li><Link to="/proveedor">Proveedor</Link></li>
                    <li><Link to="/config">Config</Link></li>
                    <li><Link to="/transacciones">Transacciones</Link></li>
                </ul>
            </nav>

            {/* Contenido */}
            <main style={{ padding: "20px" }}>
                {children}
            </main>
        </div>
    );
}

export default Layout;
