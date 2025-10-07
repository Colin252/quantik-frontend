import React, { useState } from "react";
import API from "../services/api";

function EliminarMovimiento() {
    const [id, setId] = useState("");

    const deleteMovimiento = async () => {
        try {
            await API.delete(`/movimientos/${id}`);
            alert("Movimiento eliminado ❌");
            setId("");
        } catch (err) {
            console.error("Error al eliminar movimiento", err);
        }
    };

    return (
        <div>
            <h2>🗑️ Eliminar Movimiento</h2>
            <input
                type="number"
                placeholder="Ingrese ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <button onClick={deleteMovimiento}>Eliminar</button>
        </div>
    );
}

export default EliminarMovimiento;
