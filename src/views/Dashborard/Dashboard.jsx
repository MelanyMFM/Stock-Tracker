// src/components/dashboard.js
import { useState } from "react";
import "./dashboard.css";
import { reconocerImagen } from "../../services/recImagen";

// Función auxiliar para convertir un archivo (del input file) a Base64
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Elimina el prefijo 'data:image/jpeg;base64,'
    reader.onerror = (error) => reject(error);
  });
};

export function Dashboard() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Maneja la selección del archivo por el usuario
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null); // Resetea el resultado
    setError(null);  // Resetea el error
  };

  // Maneja el proceso de reconocimiento cuando se hace clic
  const handleRecognize = async () => {
    if (!file) {
      setError("Por favor, selecciona una imagen primero.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Image = await convertFileToBase64(file);
      const mimeType = file.type;

      // Llama al servicio con la imagen Base64 y el tipo MIME
      const jsonString = await reconocerImagen(base64Image, mimeType);

      // Parsea el JSON para mostrarlo de forma más legible
      const parsedJson = JSON.parse(jsonString);

      setResult(parsedJson);
      console.log("Image recognition result (JSON Object):", parsedJson);

    } catch (e) {
      setError(`Error: ${e.message}. Asegúrate de que la clave API es válida y que la imagen es clara.`);
      console.error("Error recognizing image:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard - Reconocimiento de Trades</h1>
      <p>Sube una captura de pantalla de tu broker para extraer la información de las transacciones.</p>

      {/* Input para seleccionar el archivo */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      
      {/* Botón para iniciar el reconocimiento */}
      <button onClick={handleRecognize} disabled={!file || loading}>
        {loading ? "Reconociendo..." : "Reconocer Transacciones"}
      </button>

      {/* Muestra el resultado o el error */}
      {loading && <p>Cargando y procesando la imagen con Gemini...</p>}

      {error && <p style={{ color: 'red' }}>⚠️ {error}</p>}

      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>✅ Transacciones Reconocidas</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}