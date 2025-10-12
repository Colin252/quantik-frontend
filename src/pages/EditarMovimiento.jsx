import React, { useState } from "react";
import API from "../services/api";

function EditarMovimiento() {
    const [id, setId] = useState("");
    const [form, setForm] = useState(null);

    const fetchMovimiento = async () => {
        try {
            const res = await API.get(`/movimientos/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error("Error al cargar movimiento", err);
            setForm(null);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put(`/movimientos/${id}`, form);
            alert("Movimiento actualizado ✅");
        } catch (err) {
            console.error("Error al actualizar movimiento", err);
        }
    };

    return (
        <div>
            <h2>✏️ Editar Movimiento</h2>
            <input
                type="number"
                placeholder="Ingrese ID"
                value={id}
                onChange={(e) => setId(e.target.value)}
            />
            <button onClick={fetchMovimiento}>Cargar</button>

            {form && (
                <form onSubmit={handleSubmit}>
                    <input
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                    />
                    <input
                        name="monto"
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
                    <button type="submit">Guardar Cambios</button>
                </form>
            )}
        </div>
    );
}

export default EditarMovimiento;
