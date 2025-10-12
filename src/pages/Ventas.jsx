import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../styles/Ventas.css";

function Ventas() {
    const [clienteId, setClienteId] = useState("");
    const [productoId, setProductoId] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [total, setTotal] = useState(0);

    const [ventas, setVentas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [editandoId, setEditandoId] = useState(null);

    // 🔄 Cargar datos iniciales
    useEffect(() => {
        fetchClientes();
        fetchProductos();
        fetchVentas();
    }, []);

    const fetchClientes = async () => {
        try {
            const res = await API.get("/clientes");
            setClientes(res.data);
        } catch (err) {
            console.error("❌ Error al obtener clientes:", err);
        }
    };

    const fetchProductos = async () => {
        try {
            const res = await API.get("/productos");
            setProductos(res.data);
        } catch (err) {
            console.error("❌ Error al obtener productos:", err);
        }
    };

    const fetchVentas = async () => {
        try {
            const res = await API.get("/ventas");
            setVentas(res.data);
        } catch (err) {
            console.error("❌ Error al obtener ventas:", err);
        }
    };

    // 💰 Calcular total automáticamente
    useEffect(() => {
        if (productoId && cantidad) {
            const prod = productos.find((p) => p.id === parseInt(productoId));
            if (prod) {
                setTotal(parseFloat(prod.precio) * parseInt(cantidad));
            }
        }
    }, [productoId, cantidad, productos]);

    // 📝 Registrar o actualizar venta
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                clienteId: parseInt(clienteId),
                productoId: parseInt(productoId),
                cantidad: parseInt(cantidad),
                total,
            };

            if (editandoId) {
                await API.put(`/ventas/${editandoId}`, data);
                setMensaje("✅ Venta actualizada correctamente");
            } else {
                await API.post("/ventas", data);
                setMensaje("✅ Venta registrada correctamente");
            }

            // Reset formulario
            setClienteId("");
            setProductoId("");
            setCantidad("");
            setTotal(0);
            setEditandoId(null);
            fetchVentas();
        } catch (err) {
            console.error(err);
            setMensaje("❌ Error al guardar la venta");
        }
    };

    // 🗑️ Eliminar venta
    const handleEliminar = async (id) => {
        if (window.confirm("¿Seguro que deseas eliminar esta venta?")) {
            try {
                await API.delete(`/ventas/${id}`);
                setMensaje("🗑️ Venta eliminada correctamente");
                fetchVentas();
            } catch (err) {
                console.error(err);
                setMensaje("❌ Error al eliminar venta");
            }
        }
    };

    // ✏️ Editar venta
    const handleEditar = (venta) => {
        setClienteId(venta.clienteId);
        setProductoId(venta.productoId);
        setCantidad(venta.cantidad);
        setTotal(venta.total);
        setEditandoId(venta.id);
    };

    return (
        <div
            className="ventas-page"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/botones.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            {/* 🌑 Capa oscura sobre el fondo */}
            <div className="overlay"></div>

            <div className="ventas-container">
                <h2>🛒 Gestión de Ventas</h2>

                {/* 📋 Formulario de registro */}
                <form onSubmit={handleSubmit} className="form-venta">
                    <select
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                        required
                    >
                        <option value="">-- Seleccionar Cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.nombre}
                            </option>
                        ))}
                    </select>

                    <select
                        value={productoId}
                        onChange={(e) => setProductoId(e.target.value)}
                        required
                    >
                        <option value="">-- Seleccionar Producto --</option>
                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} - ${p.precio}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        value={cantidad}
                        placeholder="Cantidad"
                        onChange={(e) => setCantidad(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        value={total}
                        readOnly
                        placeholder="Total"
                    />

                    <button type="submit">
                        {editandoId ? "Actualizar Venta" : "Registrar Venta"}
                    </button>

                    {editandoId && (
                        <button
                            type="button"
                            onClick={() => {
                                setClienteId("");
                                setProductoId("");
                                setCantidad("");
                                setTotal(0);
                                setEditandoId(null);
                            }}
                        >
                            Cancelar
                        </button>
                    )}
                </form>

                {/* 💬 Mensaje de estado */}
                {mensaje && <p className="mensaje">{mensaje}</p>}

                {/* 🧾 Tabla de Ventas */}
                <h3>Listado de Ventas</h3>
                <table className="ventas-tabla">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Cliente</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Total</th>
                        <th>Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {ventas.length > 0 ? (
                        ventas.map((v) => (
                            <tr key={v.id}>
                                <td>{v.id}</td>
                                <td>
                                    {clientes.find(
                                        (c) => c.id === v.clienteId
                                    )?.nombre || "—"}
                                </td>
                                <td>
                                    {productos.find(
                                        (p) => p.id === v.productoId
                                    )?.nombre || "—"}
                                </td>
                                <td>{v.cantidad}</td>
                                <td>{v.total}</td>
                                <td>
                                    <button
                                        className="editar"
                                        onClick={() => handleEditar(v)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="eliminar"
                                        onClick={() =>
                                            handleEliminar(v.id)
                                        }
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">No hay ventas registradas</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Ventas;
