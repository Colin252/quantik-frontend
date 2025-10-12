import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Register.css";

function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/register", {
                username,
                email,
                password,
                role: "USER",
            });

            if (res.data.success) {
                setMensaje("✅ Usuario registrado correctamente. Ahora inicia sesión.");
                setTimeout(() => navigate("/"), 1500);
            } else {
                setMensaje("❌ " + (res.data.message || "Error al registrar usuario."));
            }
        } catch (err) {
            console.error("Error en registro:", err);
            setMensaje("❌ Error al registrar usuario.");
        }
    };

    return (
        <div className="register-page">
            {/* 🎥 Fondo humo */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/humo.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            <div className="register-container">
                <h2>📝 Crear Cuenta</h2>
                <form onSubmit={handleSubmit} className="register-form">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit">Registrar</button>
                </form>
                {mensaje && <p className="mensaje">{mensaje}</p>}
            </div>
        </div>
    );
}

export default Register;
