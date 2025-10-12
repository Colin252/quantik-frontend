import React, { useEffect, useState } from "react";
import API from "../services/api";

function ListaMovimientos() {
    const [movimientos, setMovimientos] = useState([]);

    useEffect(() => {
        fetchMovimientos();
    }, []);

    const fetchMovimientos = async () => {
        try {
            const res = await API.get("/movimientos");
            setMovimientos(res.data);
        } catch (err) {
            console.error("Error al cargar movimientos", err);
        }
    };

    return (
        <div>
            <h2>📋 Lista de Movimientos</h2>
            <ul>
                {movimientos.map((m) => (
                    <li key={m.id}>
                        {m.tipo} – ${m.monto} – {m.fecha}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ListaMovimientos;
