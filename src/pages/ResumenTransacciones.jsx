import React, { useEffect, useState } from "react";
import API from "../services/api";

function ResumenTransacciones() {
    const [resumen, setResumen] = useState([]);

    useEffect(() => {
        fetchResumen();
    }, []);

    const fetchResumen = async () => {
        try {
            const res = await API.get("/transacciones/resumen");
            setResumen(res.data);
        } catch (err) {
            console.error("Error al cargar resumen de transacciones", err);
        }
    };

    return (
        <div>
            <h2>📊 Resumen de Transacciones</h2>
            <ul>
                {resumen.length > 0 ? (
                    resumen.map((r, i) => (
                        <li key={i}>
                            {r.tipo}: {r.total}
                        </li>
                    ))
                ) : (
                    <p>No hay resumen disponible.</p>
                )}
            </ul>
        </div>
    );
}

export default ResumenTransacciones;
