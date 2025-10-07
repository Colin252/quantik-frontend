import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:8080/api/transactions";

function Config() {
    const [transacciones, setTransacciones] = useState([]);
    const [totales, setTotales] = useState({
        ingresos: 0,
        gastos: 0,
        balance: 0
    });

    // Cambia el userId si necesitas otro (por ahora usamos 1)
    const userId = 1;

    const cargarTransacciones = () => {
        axios.get(`${API}/${userId}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setTransacciones(data);

                // Calcular totales
                let ingresos = 0;
                let gastos = 0;
                data.forEach(t => {
                    if (t.type === "INGRESO") {
                        ingresos += t.amount;
                    } else if (t.type === "GASTO") {
                        gastos += t.amount;
                    }
                });

                setTotales({
                    ingresos,
                    gastos,
                    balance: ingresos - gastos
                });
            })
            .catch(err => {
                console.error("Error al cargar transacciones:", err);
                setTransacciones([]);
            });
    };

    useEffect(() => {
        cargarTransacciones();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Resumen Financiero</h2>

            <div style={{ marginBottom: "20px" }}>
                <p><strong>Total Ingresos:</strong> {totales.ingresos}</p>
                <p><strong>Total Gastos:</strong> {totales.gastos}</p>
                <p><strong>Balance:</strong> {totales.balance}</p>
            </div>

            <h3>Lista de Transacciones</h3>
            <table border="1" cellPadding="5" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Fecha</th>
                </tr>
                </thead>
                <tbody>
                {transacciones.map((t) => (
                    <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>{t.type}</td>
                        <td>{t.amount}</td>
                        <td>{t.category}</td>
                        <td>{t.description}</td>
                        <td>{t.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default Config;
