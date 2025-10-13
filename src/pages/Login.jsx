// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMensaje("");

        try {
            const response = await API.post("/auth/login", { email, password });

            if (response.data && response.data.token) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("role", response.data.role);

                setMensaje("✅ Login exitoso, redirigiendo...");
                setTimeout(() => navigate("/dashboard"), 1200);
            } else {
                setMensaje("❌ Credenciales inválidas o token ausente.");
            }
        } catch (err) {
            console.error("Error en login:", err);
            setMensaje(
                err.code === "ERR_NETWORK"
                    ? "🌐 No se pudo conectar al servidor (verifica conexión HTTPS)."
                    : "❌ Error al iniciar sesión."
            );
        } finally {
            setLoading(false);
        }
    };

    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${process.env.PUBLIC_URL}/login.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
    };

    return (
        <div className="login-page" style={backgroundStyle}>
            <div className="overlay"></div>
            <div className="login-container">
                <h1 className="app-title">Quantik</h1>
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit}>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <label>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Cargando..." : "Ingresar"}
                    </button>
                </form>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                <div className="extra-buttons">
                    <button onClick={() => navigate("/register")} disabled={loading}>
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
