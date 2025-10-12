import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Balance.css";

function Balance() {
    const [transacciones, setTransacciones] = useState([]);
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);
    const [balance, setBalance] = useState(0);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = async () => {
        try {
            const res = await API.get("/transacciones");
            setTransacciones(res.data);

            let totalIngresos = 0;
            let totalGastos = 0;

            res.data.forEach((t) => {
                if (t.tipo === "INGRESO") totalIngresos += t.monto;
                else if (t.tipo === "GASTO") totalGastos += t.monto;
            });

            setIngresos(totalIngresos);
            setGastos(totalGastos);
            setBalance(totalIngresos - totalGastos);
        } catch (err) {
            console.error("Error al cargar transacciones:", err);
        }
    };

    return (
        <div
            className="balance-page"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/botones.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="overlay"></div>

            <div className="balance-container">
                <h2>📊 Balance General</h2>

                <div className="resumen-balance">
                    <div className="card ingreso">
                        <h3>Ingresos</h3>
                        <p>₡ {ingresos.toLocaleString("es-CR")}</p>
                    </div>

                    <div className="card gasto">
                        <h3>Gastos</h3>
                        <p>₡ {gastos.toLocaleString("es-CR")}</p>
                    </div>

                    <div className={`card ${balance >= 0 ? "positivo" : "negativo"}`}>
                        <h3>Balance</h3>
                        <p>₡ {balance.toLocaleString("es-CR")}</p>
                    </div>
                </div>

                {/* 🔹 Tabla opcional de detalle */}
                {transacciones.length > 0 && (
                    <div className="tabla-balance-container">
                        <table className="tabla-balance">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Monto</th>
                                <th>Fecha</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transacciones.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.id}</td>
                                    <td>{t.tipo}</td>
                                    <td>₡ {t.monto.toLocaleString("es-CR")}</td>
                                    <td>{t.fecha}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Balance;
