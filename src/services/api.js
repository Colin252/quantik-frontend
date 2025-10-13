// src/services/api.js
import axios from "axios";

// 🌐 Proxy HTTPS en Render que reenvía al backend de la VM Quantik
const API = axios.create({
    baseURL: "https://quantik-proxy.onrender.com/api", // ✅ proxy seguro sin CORS
    timeout: 10000, // 🔹 Evita bloqueos largos
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// 🔹 Interceptor para agregar automáticamente el token JWT en cada request
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = token.startsWith("Bearer ")
                ? token
                : `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔹 Interceptor para manejar errores comunes (401, 403, red, etc.)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            console.warn("⚠️ Sesión expirada o token inválido. Cerrando sesión...");
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
        }

        if (error.message === "Network Error") {
            console.error("🚨 No se pudo conectar al proxy o al backend (Render/VM)");
        }

        return Promise.reject(error);
    }
);

export default API;
