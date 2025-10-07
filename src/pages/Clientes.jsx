import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Clientes.css";   // 🎨 estilos

function Clientes() {
    const [nombre, setNombre] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [clientes, setClientes] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await API.get("/clientes");
            setClientes(res.data);
        } catch (err) {
            console.error("Error al obtener clientes:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = { nombre, email, telefono };

            if (editandoId) {
                await API.put(`/clientes/${editandoId}`, data);
                setMensaje("Cliente actualizado ✅");
            } else {
                await API.post("/clientes", data);
                setMensaje("Cliente registrado ✅");
            }

            setNombre("");
            setEmail("");
            setTelefono("");
            setEditandoId(null);
            fetchClientes();
        } catch (err) {
            console.error(err);
            setMensaje("Error al guardar cliente ❌");
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar este cliente?")) {
            try {
                await API.delete(`/clientes/${id}`);
                setMensaje("Cliente eliminado 🗑️");
                fetchClientes();
            } catch (err) {
                console.error(err);
                setMensaje("Error al eliminar cliente ❌");
            }
        }
    };

    const handleEditar = (cliente) => {
        setNombre(cliente.nombre);
        setEmail(cliente.email);
        setTelefono(cliente.telefono);
        setEditandoId(cliente.id);
    };

    return (
        <div className="clientes-page">
            {/* 🎥 Fondo animado */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/numeros.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            {/* Caja de contenido */}
            <div className="clientes-container">
                <h2>👥 Gestión de Clientes</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="form-cliente">
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
                        placeholder="Correo"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        value={telefono}
                        placeholder="Teléfono"
                        onChange={(e) => setTelefono(e.target.value)}
                    />

                    <button type="submit">{editandoId ? "Actualizar" : "Registrar"}</button>
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
                <h3>Listado de Clientes</h3>
                <table className="clientes-tabla">
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
                    {clientes.length > 0 ? (
                        clientes.map((c) => (
                            <tr key={c.id}>
                                <td>{c.id}</td>
                                <td>{c.nombre}</td>
                                <td>{c.email}</td>
                                <td>{c.telefono}</td>
                                <td>
                                    <button className="editar" onClick={() => handleEditar(c)}>✏️</button>
                                    <button className="eliminar" onClick={() => handleEliminar(c.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay clientes registrados</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Clientes;
