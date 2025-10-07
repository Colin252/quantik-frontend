import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/Facturas.css";

function Facturas() {
    const [fecha, setFecha] = useState("");
    const [numero, setNumero] = useState("");
    const [clienteId, setClienteId] = useState("");
    const [productosSeleccionados, setProductosSeleccionados] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [ultimaFactura, setUltimaFactura] = useState(null);
    const [mensaje, setMensaje] = useState("");

    // ➕ campos manuales
    const [correoManual, setCorreoManual] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [direccion, setDireccion] = useState("");
    const [metodoPago, setMetodoPago] = useState("");
    const [notas, setNotas] = useState("");

    const tablaRef = useRef(null);

    useEffect(() => {
        fetchFacturas();
        fetchClientes();
        fetchProductos();
    }, []);

    const fetchFacturas = async () => {
        try {
            const res = await API.get("/facturas");
            setFacturas(res.data);
        } catch (err) {
            console.error("Error al obtener facturas:", err);
        }
    };

    const fetchClientes = async () => {
        try {
            const res = await API.get("/clientes");
            setClientes(res.data);
        } catch (err) {
            console.error("Error al obtener clientes:", err);
        }
    };

    const fetchProductos = async () => {
        try {
            const res = await API.get("/productos");
            setProductos(res.data);
        } catch (err) {
            console.error("Error al obtener productos:", err);
        }
    };

    const handleAgregarProducto = (id) => {
        const prod = productos.find((p) => p.id === parseInt(id));
        if (prod) {
            setProductosSeleccionados([...productosSeleccionados, { ...prod, cantidad: 1 }]);
        }
    };

    const handleCantidadChange = (id, cantidad) => {
        setProductosSeleccionados(
            productosSeleccionados.map((p) =>
                p.id === id ? { ...p, cantidad: parseInt(cantidad) } : p
            )
        );
    };

    const handleEliminarProducto = (id) => {
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.id !== id));
    };

    // ✅ guardar factura
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = {
                numero: numero || `F-${Date.now()}`,
                fecha,
                cliente: clienteId ? { id: parseInt(clienteId) } : null,
                correoManual,
                empresa,
                direccion,
                metodoPago,
                notas,
                productos: productosSeleccionados.map((p) => ({
                    id: p.id,
                    cantidad: p.cantidad
                }))
            };

            await API.post("/facturas", data);
            setMensaje("Factura registrada ✅");

            // reset inputs
            setNumero("");
            setFecha("");
            setClienteId("");
            setCorreoManual("");
            setEmpresa("");
            setDireccion("");
            setMetodoPago("");
            setNotas("");
            setProductosSeleccionados([]);

            // refrescar listado
            fetchFacturas();

            // traer la última factura
            const res = await API.get("/facturas/ultima");
            setUltimaFactura({ ...res.data });

            // scroll al final
            setTimeout(() => {
                if (tablaRef.current) {
                    tablaRef.current.scrollTop = tablaRef.current.scrollHeight;
                }
            }, 500);
        } catch (err) {
            console.error("Error al guardar factura:", err);
            setMensaje("Error al guardar factura ❌");
        }
    };

    // ✅ imprimir con estilo pro
    const handleImprimir = async (facturaId) => {
        try {
            const res = await API.get(`/facturas/${facturaId}/detalle`);
            const factura = res.data;

            const doc = new jsPDF();

            // 🔹 Título
            doc.setFontSize(20);
            doc.setTextColor(200, 0, 0);
            doc.text("Factura Quantik", 105, 20, { align: "center" });

            // 🔹 Datos del cliente/factura
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text(`Cliente: ${factura.cliente?.nombre || "-"}`, 14, 40);
            doc.text(`Email: ${factura.correoManual || factura.cliente?.correo || "-"}`, 14, 48);
            doc.text(`Tel: ${factura.cliente?.telefono || "-"}`, 14, 56);
            doc.text(`Empresa: ${factura.empresa || "-"}`, 14, 64);
            doc.text(`Dirección: ${factura.direccion || "-"}`, 14, 72);
            doc.text(`Método de Pago: ${factura.metodoPago || "-"}`, 14, 80);
            doc.text(`Notas: ${factura.notas || "-"}`, 14, 88);

            doc.text(`Número: ${factura.numero}`, 150, 40);
            doc.text(`Fecha: ${factura.fecha}`, 150, 48);

            // 🔹 Tabla de productos
            if (factura.productos && factura.productos.length > 0) {
                const tabla = factura.productos.map((p) => [
                    p.nombre,
                    p.cantidad || 1,
                    `₡${p.precio.toLocaleString("es-CR")}`,
                    `₡${((p.cantidad || 1) * p.precio).toLocaleString("es-CR")}`
                ]);

                autoTable(doc, {
                    startY: 100,
                    head: [["Producto", "Cantidad", "Precio Unitario", "Subtotal"]],
                    body: tabla,
                    theme: "grid",
                    headStyles: {
                        fillColor: [200, 0, 0],
                        textColor: [255, 255, 255],
                        fontSize: 12,
                        halign: "center"
                    },
                    bodyStyles: {
                        halign: "center"
                    },
                    styles: {
                        cellPadding: 4,
                        fontSize: 11
                    },
                    alternateRowStyles: { fillColor: [240, 240, 240] }
                });
            }

            // 🔹 Total destacado
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 120;
            doc.text(`TOTAL: ₡${factura.montoTotal.toLocaleString("es-CR")}`, 14, finalY);

            // 🔹 Guardar
            doc.save(`factura_${factura.id}.pdf`);
        } catch (err) {
            console.error("Error al imprimir factura:", err);
            alert("Error al generar la factura en PDF ❌");
        }
    };

    // ✅ eliminar factura
    const handleEliminarFactura = async (facturaId) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta factura?")) return;
        try {
            await API.delete(`/facturas/${facturaId}`);
            setFacturas(facturas.filter((f) => f.id !== facturaId));
            setMensaje("Factura eliminada ❌");
        } catch (err) {
            console.error("Error al eliminar factura:", err);
            setMensaje("Error al eliminar factura ❌");
        }
    };

    return (
        <div className="facturas-page">
            {/* 🎥 Fondo animado con numeros.mp4 */}
            <video autoPlay loop muted playsInline className="background-video">
                <source src="/numeros.mp4" type="video/mp4" />
            </video>
            <div className="overlay"></div>

            <div className="facturas-container">
                <h2>🧾 Gestión de Facturas</h2>

                <form onSubmit={handleSubmit} className="form-factura">
                    <input type="text" placeholder="Número de factura" value={numero} onChange={(e) => setNumero(e.target.value)} />
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required />

                    <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
                        <option value="">-- Seleccionar cliente --</option>
                        {clientes.map((c) => (
                            <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))}
                    </select>

                    <input type="email" placeholder="Correo (manual)" value={correoManual} onChange={(e) => setCorreoManual(e.target.value)} />
                    <input type="text" placeholder="Empresa" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
                    <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
                    <input type="text" placeholder="Método de pago" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)} />
                    <textarea placeholder="Notas / Observaciones" value={notas} onChange={(e) => setNotas(e.target.value)} />

                    <select onChange={(e) => handleAgregarProducto(e.target.value)}>
                        <option value="">-- Agregar producto --</option>
                        {productos.map((p) => (
                            <option key={p.id} value={p.id}>{p.nombre} (₡{p.precio})</option>
                        ))}
                    </select>

                    <button type="submit">Registrar Factura</button>
                </form>

                {productosSeleccionados.length > 0 && (
                    <table className="facturas-tabla">
                        <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Precio</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {productosSeleccionados.map((p) => (
                            <tr key={p.id}>
                                <td>{p.nombre}</td>
                                <td>₡{p.precio}</td>
                                <td>
                                    <input type="number" min="1" value={p.cantidad} onChange={(e) => handleCantidadChange(p.id, e.target.value)} />
                                </td>
                                <td>₡{p.precio * p.cantidad}</td>
                                <td><button onClick={() => handleEliminarProducto(p.id)}>❌</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}

                {mensaje && <p className="mensaje">{mensaje}</p>}

                {ultimaFactura && (
                    <div className="ultima-factura">
                        <h3>Última Factura Registrada</h3>
                        <p><strong>Número:</strong> {ultimaFactura.numero}</p>
                        <p><strong>Cliente:</strong> {ultimaFactura.cliente?.nombre}</p>
                        <p><strong>Email:</strong> {ultimaFactura.correoManual || ultimaFactura.cliente?.correo}</p>
                        <p><strong>Tel:</strong> {ultimaFactura.cliente?.telefono}</p>
                        <p><strong>Empresa:</strong> {ultimaFactura.empresa}</p>
                        <p><strong>Dirección:</strong> {ultimaFactura.direccion}</p>
                        <p><strong>Método de Pago:</strong> {ultimaFactura.metodoPago}</p>
                        <p><strong>Notas:</strong> {ultimaFactura.notas}</p>
                        <p><strong>Total:</strong> ₡{ultimaFactura.montoTotal}</p>
                        <button className="imprimir" onClick={() => handleImprimir(ultimaFactura.id)}>🖨️ Imprimir</button>
                    </div>
                )}

                <h3>Listado de Facturas</h3>
                <div className="facturas-tabla-container" ref={tablaRef}>
                    <table className="facturas-tabla">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {facturas.length > 0 ? (
                            facturas.map((f) => (
                                <tr key={f.id}>
                                    <td>{f.id}</td>
                                    <td>{f.fecha}</td>
                                    <td>₡{f.montoTotal}</td>
                                    <td>
                                        <button className="imprimir" onClick={() => handleImprimir(f.id)}>🖨️</button>
                                        <button className="eliminar" onClick={() => handleEliminarFactura(f.id)}>❌</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No hay facturas registradas</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Facturas;
