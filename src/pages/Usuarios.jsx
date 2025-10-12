import React, { useEffect, useState } from "react";
import API from "../services/api";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "USER",
    });

    // cargar usuarios al inicio
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const res = await API.get("/users"); // ⚠️ endpoint debe existir en backend
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error al cargar usuarios", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/api/auth/register", form); // usamos el endpoint de registro
            setForm({ email: "", password: "", role: "USER" });
            fetchUsuarios(); // recargar lista
        } catch (err) {
            console.error("Error al registrar usuario", err);
        }
    };

    return (
        <div>
            <h2>Usuarios</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Correo"
                    value={form.email}
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                />
                <select name="role" value={form.role} onChange={handleChange}>
                    <option value="USER">Usuario</option>
                    <option value="ADMIN">Administrador</option>
                </select>
                <button type="submit">Registrar Usuario</button>
            </form>

            <ul>
                {usuarios.map((u) => (
                    <li key={u.id}>
                        {u.email} - Rol: {u.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Usuarios;
