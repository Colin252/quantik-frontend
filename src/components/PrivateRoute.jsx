import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
    const token = localStorage.getItem("token");

    // Si no hay token → redirige al login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token → muestra la ruta
    return children;
}

export default PrivateRoute;
