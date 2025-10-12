import React, { useState } from "react";
import API from "../services/api";

function AgregarMovimiento() {
    const [form, setForm] = useState({
        tipo: "",
        monto: "",
        fecha: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post("/movimientos", form);
            alert("Movimiento agregado con éxito ✅");
            setForm({ tipo: "", monto: "", fecha: "" });
        } catch (err) {
            console.error("Error al agregar movimiento", err);
        }
    };

    return (
        <div>
            <h2>➕ Agregar Movimiento</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name="tipo"
                    placeholder="Tipo (INGRESO o GASTO)"
                    value={form.tipo}
                    onChange={handleChange}
                />
                <input
                    name="monto"
                    placeholder="Monto"
                    type="number"
                    value={form.monto}
                    onChange={handleChange}
                />
                <input
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onChange={handleChange}
                />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default AgregarMovimiento;
