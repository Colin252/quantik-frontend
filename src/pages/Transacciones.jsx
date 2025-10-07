import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Transacciones.css";

function Transacciones() {
    const [tipo, setTipo] = useState("");
    const [monto, setMonto] = useState("");
    const [fecha, setFecha] = useState("");

    const [transacciones, setTransacciones] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = async () => {
        try {
            const res = await API.get("/transacciones");
            setTransacciones(res.data);
        } catch (err) {
            console.error("Error al obtener transacciones:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                tipo,
                monto: parseFloat(monto),
                fecha,
            };

            if (editandoId) {
                await API.put(`/transacciones/${editandoId}`, data);
                setMensaje("Transacción actualizada ✅");
            } else {
                await API.post("/transacciones", data);
                setMensaje("Transacción registrada ✅");
            }

            setTipo("");
            setMonto("");
            setFecha("");
            setEditandoId(null);
            fetchTransacciones();
        } catch (err) {
            console.error(err);
            setMensaje("Error al guardar transacción ❌");
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta transacción?")) {
            try {
                await API.delete(`/transacciones/${id}`);
                setMensaje("Transacción eliminada 🗑️");
                fetchTransacciones();
            } catch (err) {
                console.error(err);
                setMensaje("Error al eliminar transacción ❌");
            }
        }
    };

    const handleEditar = (t) => {
        setTipo(t.tipo);
        setMonto(t.monto);
        setFecha(t.fecha);
        setEditandoId(t.id);
    };

    return (
        <div className="transacciones-page">
            {/* 🎥 Fondo con video */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/numeros.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            <div className="transacciones-container">
                <h2>💸 Gestión de Transacciones</h2>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="form-transaccion">
                    <select value={tipo} onChange={(e) => setTipo(e.target.value)} required>
                        <option value="">-- Tipo --</option>
                        <option value="INGRESO">Ingreso</option>
                        <option value="GASTO">Gasto</option>
                    </select>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Monto"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                    />

                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {editandoId ? "Actualizar" : "Registrar"}
                    </button>
                    {editandoId && (
                        <button
                            type="button"
                            onClick={() => {
                                setTipo("");
                                setMonto("");
                                setFecha("");
                                setEditandoId(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>

                {mensaje && <p className="mensaje">{mensaje}</p>}

                {/* Tabla */}
                <h3>Listado de Transacciones</h3>
                <table className="transacciones-tabla">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tipo</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {transacciones.length > 0 ? (
                        transacciones.map((t) => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.tipo}</td>
                                <td>{t.monto}</td>
                                <td>{t.fecha}</td>
                                <td>
                                    <button className="editar" onClick={() => handleEditar(t)}>✏️</button>
                                    <button className="eliminar" onClick={() => handleEliminar(t.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No hay transacciones registradas</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Transacciones;
