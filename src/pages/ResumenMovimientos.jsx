import React, { useEffect, useState } from "react";
import API from "../services/api";

function ResumenMovimientos() {
    const [resumen, setResumen] = useState(null);

    useEffect(() => {
        fetchResumen();
    }, []);

    const fetchResumen = async () => {
        try {
            const res = await API.get("/movimientos/resumen");
            setResumen(res.data);
        } catch (err) {
            console.error("Error al cargar resumen", err);
        }
    };

    return (
        <div>
            <h2>📌 Resumen de Movimientos</h2>
            {resumen ? (
                <ul>
                    <li>Ingresos: ${resumen.ingresos}</li>
                    <li>Gastos: ${resumen.gastos}</li>
                    <li>Balance Neto: ${resumen.balance}</li>
                </ul>
            ) : (
                <p>Cargando resumen...</p>
            )}
        </div>
    );
}

export default ResumenMovimientos;
