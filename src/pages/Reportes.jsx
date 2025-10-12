import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from "recharts";
import "../styles/Reportes.css";

function Reportes() {
    const [dataMensual, setDataMensual] = useState([]);
    const [dataTipo, setDataTipo] = useState([]);

    useEffect(() => {
        fetchTransacciones();
    }, []);

    const fetchTransacciones = async () => {
        try {
            const res = await API.get("/transacciones");
            procesarDatos(res.data);
        } catch (err) {
            console.error("Error al cargar transacciones:", err);
        }
    };

    const procesarDatos = (transacciones) => {
        const agrupadoMes = {};
        const resumenTipo = { INGRESO: 0, GASTO: 0 };

        transacciones.forEach((t) => {
            const mes = new Date(t.fecha).toLocaleString("es-CR", { month: "short", year: "numeric" });
            if (!agrupadoMes[mes]) agrupadoMes[mes] = { mes, ingresos: 0, gastos: 0 };
            if (t.tipo === "INGRESO") {
                agrupadoMes[mes].ingresos += t.monto;
                resumenTipo.INGRESO += t.monto;
            } else {
                agrupadoMes[mes].gastos += t.monto;
                resumenTipo.GASTO += t.monto;
            }
        });

        setDataMensual(Object.values(agrupadoMes));
        setDataTipo([
            { name: "Ingresos", value: resumenTipo.INGRESO },
            { name: "Gastos", value: resumenTipo.GASTO },
        ]);
    };

    const colores = ["#00C49F", "#FF4444"];

    return (
        <div
            className="reportes-page"
            style={{
                backgroundImage: `url(${process.env.PUBLIC_URL + "/botones.webp"})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="overlay"></div>

            <div className="reportes-container">
                <h2>📊 Reportes Financieros</h2>

                <div className="chart-container">
                    <h3>📅 Ingresos vs Gastos por Mes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dataMensual}>
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

                <div className="chart-container">
                    <h3>💰 Distribución Ingresos/Gastos</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dataTipo}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                label
                            >
                                {dataTipo.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #ff0000",
                                    color: "#fff",
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}

export default Reportes;
