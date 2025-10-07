import React, { useEffect, useState } from "react";
import API from "../services/api";

function Resumen() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetchResumen();
    }, []);

    const fetchResumen = async () => {
        try {
            const res = await API.get("/resumen");
            setData(res.data);
        } catch (err) {
            console.error("Error al cargar resumen", err);
        }
    };

    return (
        <div>
            <h2>📊 Resumen de Movimientos</h2>
            {data ? (
                <ul>
                    <li>Total Ingresos: ${data.totalIngresos}</li>
                    <li>Total Gastos: ${data.totalGastos}</li>
                    <li>Balance: ${data.balance}</li>
                </ul>
            ) : (
                <p>Cargando resumen...</p>
            )}
        </div>
    );
}

export default Resumen;
