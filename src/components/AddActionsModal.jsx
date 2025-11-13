import { useState } from "react";
import { useActions } from "../context/ActionsContext";
import { reconocerImagen } from "../services/recImagen";

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (err) => reject(err);
  });
};

export default function AddActionsModal() {
  const { addActions } = useActions();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRecognize = async () => {
    if (!file) return alert("Selecciona una imagen primero");

    setLoading(true);

    try {
      const base64 = await convertFileToBase64(file);
      const mimeType = file.type;
      const json = await reconocerImagen(base64, mimeType);
      const parsed = JSON.parse(json);

      // Mostrar las acciones reconocidas antes de añadirlas
      const ok = window.confirm(
        `Se encontraron ${parsed.transacciones.length} transacciones:\n\n${parsed.transacciones
          .map((t) => `• ${t.nombre} a ${t.precio}`)
          .join("\n")}\n\n¿Deseas añadirlas al registro?`
      );

      if (ok) addActions(parsed.transacciones);
    } catch (error) {
      console.error(error);
      alert("Error al reconocer la imagen. Verifica la captura o la clave API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />
      <button
        onClick={handleRecognize}
        disabled={!file || loading}
        style={{ marginLeft: "10px" }}
      >
        {loading ? "Reconociendo..." : "Reconocer y Añadir"}
      </button>

      {loading && (
        <p style={{ marginTop: "10px", color: "#555" }}>
          Reconociendo imagen...
        </p>
      )}
    </div>
  );
}
