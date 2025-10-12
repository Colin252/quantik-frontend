import React, { useEffect, useState } from "react";
import API from "../services/api";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";
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
                .filter((t) => t.tipo === "INGRESO")
                .reduce((acc, t) => acc + t.monto, 0);

            const totalGastos = transacciones
                .filter((t) => t.tipo === "GASTO")
                .reduce((acc, t) => acc + t.monto, 0);

            setIngresos(totalIngresos);
            setGastos(totalGastos);

            const agrupado = {};
            transacciones.forEach((t) => {
                const mes = new Date(t.fecha).toLocaleString("es-CR", {
                    month: "short",
                    year: "numeric",
                });
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
        <div
            className="estadisticas-page"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/botones.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="overlay"></div>

            <div className="estadisticas-container">
                <h2>📈 Estadísticas Generales</h2>

                {/* Tarjetas resumen */}
                <div className="cards">
                    <div className="card ingreso">
                        <h3>Ingresos Totales</h3>
                        <p>₡{ingresos.toLocaleString("es-CR")}</p>
                    </div>
                    <div className="card gasto">
                        <h3>Gastos Totales</h3>
                        <p>₡{gastos.toLocaleString("es-CR")}</p>
                    </div>
                    <div
                        className={`card balance ${
                            ingresos - gastos >= 0 ? "positivo" : "negativo"
                        }`}
                    >
                        <h3>Balance Neto</h3>
                        <p>₡{(ingresos - gastos).toLocaleString("es-CR")}</p>
                    </div>
                </div>

                {/* Gráfico de barras */}
                <div className="chart-container">
                    <h3>📊 Evolución Mensual</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            <XAxis dataKey="mes" tick={{ fill: "#fff" }} />
                            <YAxis tick={{ fill: "#fff" }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #ff0000",
                                    color: "#fff",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="ingresos" fill="#00C49F" name="Ingresos" />
                            <Bar dataKey="gastos" fill="#FF4444" name="Gastos" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Estadisticas;
