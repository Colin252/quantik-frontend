import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await API.post("/auth/login", { email, password });
            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("role", response.data.role);

                setMensaje("Login exitoso ✅");
                navigate("/dashboard");
            } else {
                setMensaje(response.data.message || "Credenciales inválidas ❌");
            }
        } catch (err) {
            console.error("Error en login:", err);
            setMensaje("Error al iniciar sesión ❌");
        }
    };

    // 🔥 Fondo dinámico con imagen del public
    const backgroundStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url(${process.env.PUBLIC_URL}/login.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
    };

    return (
        <div className="login-page" style={backgroundStyle}>
            {/* Overlay */}
            <div className="overlay"></div>

            {/* Caja de login */}
            <div className="login-container">
                <h1 className="app-title">Quantik</h1>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Iniciar Sesión</button>
                </form>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                <div className="extra-buttons">
                    <button onClick={() => navigate("/register")}>Registrarse</button>
                </div>
            </div>
        </div>
    );
}

export default Login;
