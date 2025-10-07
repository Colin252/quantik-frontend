// src/pages/RegistrarFactura.jsx
import React, { useState } from "react";
import API from "../services/api";

function RegistrarFactura() {
    const [numero, setNumero] = useState("");
    const [fecha, setFecha] = useState("");
    const [montoTotal, setMontoTotal] = useState("");
    const [mensaje, setMensaje] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nuevaFactura = {
                numero,
                fecha,
                montoTotal: parseFloat(montoTotal),
            };

            // 🔹 Enviar al backend
            const res = await API.post("/facturas", nuevaFactura);

            // 🔹 Guardar en localStorage para imprimir después
            localStorage.setItem("factura", JSON.stringify(nuevaFactura));

            setMensaje("Factura registrada ✅: " + JSON.stringify(res.data));
            setNumero("");
            setFecha("");
            setMontoTotal("");
        } catch (err) {
            console.error(err);
            setMensaje("Error al registrar factura ❌");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Registrar Factura</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Número:</label>
                    <input
                        type="text"
                        value={numero}
                        onChange={(e) => setNumero(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Fecha:</label>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Monto Total:</label>
                    <input
                        type="number"
                        value={montoTotal}
                        onChange={(e) => setMontoTotal(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Registrar</button>
            </form>

            {mensaje && <p>{mensaje}</p>}
        </div>
    );
}

export default RegistrarFactura;
