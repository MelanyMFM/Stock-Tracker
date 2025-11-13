import { useState, useMemo } from "react";
import { useActions } from "../context/ActionsContext";
import { getStockPrice } from "../services/stockServices";

export default function ActionsTable() {
  const { actions, removeAction, updateAction } = useActions();
  const [search, setSearch] = useState("");

  // prueba stock api
  const pruebaact = actions[1]
  console.log(pruebaact);

  async function test() {
    const symbol =  pruebaact.nombre//"AAPL";  // símbolo de Apple
    const price = await getStockPrice(symbol);
    console.log(`Precio para ${symbol}:`, price);
  }
  
  test();

  // Filtrar acciones según la búsqueda
  const filtered = useMemo(() => {
    return actions.filter((a) =>
      a.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }, [actions, search]);

  // Calcular total invertido
  const totalInvertido = useMemo(() => {
    return filtered.reduce((acc, a) => acc + a.precio * a.cantidad, 0);
  }, [filtered]);

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>
        Total:{" "}
        <span style={{ color: "#007bff" }}>
          ${totalInvertido.toLocaleString()}
        </span>
      </h3>

      <input
        type="text"
        placeholder="Buscar"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: "10px 0",
          padding: "5px 10px",
          width: "50%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Fecha</th>
            <th>Actual</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a, index) => (
            <tr key={index}>
              <td>{a.nombre}</td>
              <td>${a.precio}</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={a.cantidad}
                  onChange={(e) =>
                    updateAction(index, {
                      ...a,
                      cantidad: parseInt(e.target.value) || 1,
                    })
                  }
                  style={{
                    width: "60px",
                    textAlign: "center",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                  }}
                />
              </td>
              <td>{a.fecha}</td>
              <td>
                actual
              </td>
              <td>
                <button
                  onClick={() => removeAction(index)}
                  style={{
                    background: "transparent",
                    color: "red",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ✖
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          No se encontraron acciones.
        </p>
      )}
    </div>
  );
}
