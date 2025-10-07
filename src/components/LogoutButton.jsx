import React from "react";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // 🔹 Limpiar datos de sesión
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");

        console.log("👋 Sesión cerrada correctamente");

        // 🔹 Redirigir al login
        navigate("/");
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                backgroundColor: "#e63946",
                color: "#fff",
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                marginBottom: "20px"
            }}
        >
            Cerrar Sesión
        </button>
    );
}

export default LogoutButton;
