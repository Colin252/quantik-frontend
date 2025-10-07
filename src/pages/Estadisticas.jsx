import React, { useEffect, useState } from "react";
import API from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/Estadisticas.css";

function Estadisticas() {
    const [data, setData] = useState([]);
    const [ingresos, setIngresos] = useState(0);
    const [gastos, setGastos] = useState(0);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await API.get("/transacciones");
            const transacciones = res.data;

            const totalIngresos = transacciones
                .filter(t => t.tipo === "INGRESO")
                .reduce((acc, t) => acc + t.monto, 0);

            const totalGastos = transacciones
                .filter(t => t.tipo === "GASTO")
                .reduce((acc, t) => acc + t.monto, 0);

            setIngresos(totalIngresos);
            setGastos(totalGastos);

            // 🔹 Agrupar por mes
            const agrupado = {};
            transacciones.forEach(t => {
                const mes = new Date(t.fecha).toLocaleString("default", { month: "short", year: "numeric" });
                if (!agrupado[mes]) agrupado[mes] = { mes, ingresos: 0, gastos: 0 };
                if (t.tipo === "INGRESO") agrupado[mes].ingresos += t.monto;
                if (t.tipo === "GASTO") agrupado[mes].gastos += t.monto;
            });

            setData(Object.values(agrupado));
        } catch (err) {
            console.error("Error al cargar estadísticas:", err);
        }
    };

    return (
        <div className="estadisticas-page">
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/numeros.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            <div className="estadisticas-container">
                <h2>📊 Estadísticas Generales</h2>

                {/* Tarjetas resumen */}
                <div className="cards">
                    <div className="card ingreso">
                        <h3>Total Ingresos</h3>
                        <p>₡{ingresos}</p>
                    </div>
                    <div className="card gasto">
                        <h3>Total Gastos</h3>
                        <p>₡{gastos}</p>
                    </div>
                    <div className="card balance">
                        <h3>Balance Neto</h3>
                        <p>₡{ingresos - gastos}</p>
                    </div>
                </div>

                {/* Gráfico */}
                <div className="chart-container">
                    <h3>Evolución Mensual</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="ingresos" fill="#00ffcc" />
                            <Bar dataKey="gastos" fill="#ff4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;
