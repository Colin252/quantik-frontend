import React, { useEffect, useState } from "react";
import API from "../services/api";

function ListaTransacciones() {
    const [transacciones, setTransacciones] = useState([]);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = async () => {
        try {
            const res = await API.get("/transacciones");
            setTransacciones(res.data);
        } catch (err) {
            console.error("Error al cargar transacciones", err);
        }
    };

    return (
        <div>
            <h2>📋 Lista de Transacciones</h2>
            <ul>
                {transacciones.length > 0 ? (
                    transacciones.map((t) => (
                        <li key={t.id}>
                            {t.tipo} - {t.monto} - {t.fecha}
                        </li>
                    ))
                ) : (
                    <p>No hay transacciones registradas.</p>
                )}
            </ul>
        </div>
    );
}

export default ListaTransacciones;
