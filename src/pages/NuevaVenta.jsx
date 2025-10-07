// src/pages/NuevaVenta.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const API_PRODUCTOS = "http://localhost:8080/api/productos";
const API_TRANSACCIONES = "http://localhost:8080/api/transactions";

function NuevaVenta() {
    const [productos, setProductos] = useState([]);
    const [form, setForm] = useState({
        id: null,
        codigo: "",
        descripcion: "",
        precio: "",
        stock: 1,
    });

    const userId = localStorage.getItem("userId") || 1;

    useEffect(() => {
        cargarProductos();
    }, []);

    const cargarProductos = () => {
        axios.get(API_PRODUCTOS)
            .then(res => {
                setProductos(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("Error al listar productos:", err);
                setProductos([]);
            });
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const guardarProducto = async () => {
        try {
            const producto = {
                codigo: form.codigo,
                descripcion: form.descripcion,
                precio: parseFloat(form.precio),
                stock: parseInt(form.stock)
            };

            let productoFinal;

            if (form.id) {
                // Actualizar producto
                await axios.put(`${API_PRODUCTOS}/${form.id}`, producto);
                productoFinal = { ...producto, id: form.id };
            } else {
                // Crear nuevo
                const res = await axios.post(API_PRODUCTOS, producto);
                productoFinal = res.data;
            }

            // Transacción de ingreso
            const transaccion = {
                type: "INGRESO",
                amount: producto.precio * producto.stock,
                category: "Venta",
                description: `Venta de ${producto.descripcion}`,
                date: new Date().toISOString().split("T")[0],
                producto: { id: productoFinal.id }
            };

            await axios.post(`${API_TRANSACCIONES}/${userId}`, transaccion);

            setForm({ id: null, codigo: "", descripcion: "", precio: "", stock: 1 });
            cargarProductos();
            alert("✅ Producto guardado y transacción creada");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("❌ Error al guardar producto o transacción");
        }
    };

    const editarProducto = (producto) => {
        setForm({
            id: producto.id,
            codigo: producto.codigo,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: producto.stock
        });
    };

    const eliminarProducto = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este producto?")) {
            try {
                await axios.delete(`${API_PRODUCTOS}/${id}`);
                cargarProductos();
                alert("Producto eliminado");
            } catch (error) {
                console.error("Error al eliminar:", error);
                alert("Error al eliminar el producto");
            }
        }
    };

    return (
        <div>
            <h2>Nueva Venta</h2>

            <input name="codigo" placeholder="Código" value={form.codigo} onChange={handleChange} />
            <input name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
            <input name="precio" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} />
            <input name="stock" type="number" placeholder="Cantidad" value={form.stock} onChange={handleChange} />

            <button onClick={guardarProducto}>{form.id ? "Actualizar" : "Guardar"}</button>

            <table>
                <thead>
                <tr>
                    <th>ID</th><th>Descripción</th><th>Cant</th><th>Precio U.</th><th>Total</th><th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {productos.map((p) => (
                    <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{p.descripcion}</td>
                        <td>{p.stock}</td>
                        <td>{p.precio}</td>
                        <td>{p.precio * p.stock}</td>
                        <td>
                            <button onClick={() => editarProducto(p)}>Editar</button>
                            <button onClick={() => eliminarProducto(p.id)} style={{ marginLeft: "5px", color: "red" }}>Eliminar</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default NuevaVenta;
