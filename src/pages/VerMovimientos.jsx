import React, { useState } from "react";
import API from "../services/api";

function VerMovimiento() {
    const [id, setId] = useState("");
    const [movimiento, setMovimiento] = useState(null);

    const fetchMovimiento = async () => {
        try {
            const res = await API.get(`/movimientos/${id}`);
            setMovimiento(res.data);
        } catch (err) {
            console.error("Error al cargar movimiento", err);
            setMovimiento(null);
        }
    };

    return (
        <div>
            <h2>🔍 Ver Movimiento</h2>
            <input
                type="number"
                placeholder="Ingrese ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <button onClick={fetchMovimiento}>Buscar</button>

            {movimiento ? (
                <div style={{ marginTop: "15px" }}>
                    <p><b>ID:</b> {movimiento.id}</p>
                    <p><b>Tipo:</b> {movimiento.tipo}</p>
                    <p><b>Monto:</b> ${movimiento.monto}</p>
                    <p><b>Fecha:</b> {movimiento.fecha}</p>
                </div>
            ) : (
                <p>No hay resultados</p>
            )}
        </div>
    );
}

export default VerMovimiento;
