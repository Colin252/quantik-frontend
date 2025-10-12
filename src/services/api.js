// src/services/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://136.112.45.90.nip.io/api", // ⚙️ IP externa segura (https + nip.io)
});

// 🔹 Request interceptor: añade Authorization si existe token
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

// 🔹 Response interceptor: manejar 401/403 → limpiar token
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            localStorage.removeItem("token");
            localStorage.removeItem("email");
            localStorage.removeItem("role");
            // window.location.href = "/"; // opcional redirigir al login
        }
        return Promise.reject(error);
    }
);

export default API;
