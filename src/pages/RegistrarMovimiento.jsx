import React from "react";

function RegistrarMovimiento() {
    return (
        <div>
            <h2>📝 Registrar Movimiento</h2>
            <form>
                <input type="text" placeholder="Descripción" />
                <input type="number" placeholder="Monto" />
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
}

export default RegistrarMovimiento;
