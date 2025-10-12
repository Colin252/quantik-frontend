// src/services/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://136-112-45-90.nip.io:8443/api", // ✅ conexión HTTPS real a tu backend
});

// 🔹 Interceptor para agregar el token automáticamente
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

// 🔹 Interceptor para manejar errores 401/403 y limpiar sesión
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
        }

        // Muestra error de red en consola para debug
        if (error.message === "Network Error") {
            console.error("🚨 No se pudo conectar al backend (verifica HTTPS o CORS)");
        }

        return Promise.reject(error);
    }
);

export default API;
