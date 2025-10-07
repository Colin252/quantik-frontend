import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Proveedores.css";   // 🎨 estilos específicos

function Proveedores() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [proveedores, setProveedores] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetchProveedores();
    }, []);

    const fetchProveedores = async () => {
        try {
            const res = await API.get("/proveedores");
            setProveedores(res.data);
        } catch (err) {
            console.error("Error al obtener proveedores:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { nombre, email, telefono };

            if (editandoId) {
                await API.put(`/proveedores/${editandoId}`, data);
                setMensaje("Proveedor actualizado ✅");
            } else {
                await API.post("/proveedores", data);
                setMensaje("Proveedor registrado ✅");
            }

            setNombre("");
            setEmail("");
            setTelefono("");
            setEditandoId(null);
            fetchProveedores();
        } catch (err) {
            console.error(err);
            setMensaje("Error al guardar proveedor ❌");
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este proveedor?")) {
            try {
                await API.delete(`/proveedores/${id}`);
                setMensaje("Proveedor eliminado 🗑️");
                fetchProveedores();
            } catch (err) {
                console.error(err);
                setMensaje("Error al eliminar proveedor ❌");
            }
        }
    };

    const handleEditar = (proveedor) => {
        setNombre(proveedor.nombre);
        setEmail(proveedor.email);
        setTelefono(proveedor.telefono);
        setEditandoId(proveedor.id);
    };

    return (
        <div className="proveedores-page">
            {/* 🎥 Fondo con video */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/numeros.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            {/* Caja principal */}
            <div className="proveedores-container">
                <h2>🏭 Gestión de Proveedores</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="form-proveedor">
                    <input
                        type="text"
                        value={nombre}
                        placeholder="Nombre"
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        value={telefono}
                        placeholder="Teléfono"
                        onChange={(e) => setTelefono(e.target.value)}
                    />

                    <button type="submit">
                        {editandoId ? "Actualizar Proveedor" : "Registrar Proveedor"}
                    </button>
                    {editandoId && (
                        <button
                            type="button"
                            onClick={() => {
                                setNombre("");
                                setEmail("");
                                setTelefono("");
                                setEditandoId(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                {/* Tabla */}
                <h3>Listado de Proveedores</h3>
                <table className="proveedores-tabla">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {proveedores.length > 0 ? (
                        proveedores.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.nombre}</td>
                                <td>{p.email}</td>
                                <td>{p.telefono}</td>
                                <td>
                                    <button className="editar" onClick={() => handleEditar(p)}>✏️</button>
                                    <button className="eliminar" onClick={() => handleEliminar(p.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay proveedores registrados</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Proveedores;
