import React, { useState } from "react";
import API from "../services/api";

function BuscarMovimiento() {
    const [tipo, setTipo] = useState("");
    const [fecha, setFecha] = useState("");
    const [resultados, setResultados] = useState([]);

    const handleBuscar = async () => {
        try {
            const res = await API.get("/buscar-movimientos", {
                params: { tipo, fecha }
            });
            setResultados(res.data);
        } catch (err) {
            console.error("Error al buscar movimientos", err);
        }
    };

    return (
        <div>
            <h2>🔎 Buscar Movimiento</h2>
            <input
                placeholder="Tipo (INGRESO o GASTO)"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
            />
            <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
            />
            <button onClick={handleBuscar}>Buscar</button>

            <ul>
                {resultados.map((m) => (
                    <li key={m.id}>
                        {m.tipo} - ${m.monto} - {m.fecha}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BuscarMovimiento;
