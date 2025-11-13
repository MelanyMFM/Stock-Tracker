// src/services/recImagen.js
import { GoogleGenAI } from "@google/genai";

// Inicializa el cliente de la IA
const ai = new GoogleGenAI({ 
  // Accede a la variable de entorno configurada
  apiKey: import.meta.env.VITE_GEMINI_API_KEY 
});


/**
 * Convierte un archivo de imagen local a un objeto de contenido de la API de Gemini.
 * Esto requiere que el archivo ya esté cargado en un formato de Buffer o similar.
 * En un entorno de navegador, necesitarás usar FileReader para obtener Base64.
 *
 * @param {string} path - La ruta o URL del archivo. (Aquí simulamos el Base64)
 * @param {string} mimeType - El tipo MIME del archivo (ej. 'image/png', 'image/jpeg').
 * @returns {{inlineData: {data: string, mimeType: string}}} Objeto de contenido.
 */
function fileToGenerativePart(base64Data, mimeType) {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

/**
 * Reconoce transacciones en una imagen de broker y devuelve un JSON.
 *
 * @param {string} imageBase64 - La imagen del broker codificada en Base64.
 * @param {string} mimeType - El tipo MIME de la imagen (ej. 'image/png').
 * @returns {Promise<string>} La respuesta del modelo (una cadena JSON).
 */
export async function reconocerImagen(imageBase64, mimeType) {
  // 1. Prepara la parte de la imagen
  const imagePart = fileToGenerativePart(imageBase64, mimeType);

  // 2. Define la solicitud con la imagen y el prompt estructurado
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      // El prompt clave: instruye al modelo a extraer la información y usar JSON.
      contents: [
        imagePart,
        {
          text: `De esta captura de pantalla de un broker, identifica todas las transacciones. 
          Para cada transacción, extrae el ID, el nombre del activo y el precio. 
          Devuelve el resultado ÚNICAMENTE como una cadena JSON con el siguiente formato: 
          {"transacciones": [ {"id": "...", "nombre": "...", "precio": "..."}, ... ]}`,
        },
      ],
      config: {
          // Esto ayuda a forzar la salida JSON.
          responseMimeType: "application/json"
      }
    });

    // 3. Devuelve la respuesta (que será una cadena JSON)
    return response.text;

  } catch (error) {
    console.error("Error en la API de Gemini:", error);
    // Relanza el error para que pueda ser capturado por .catch()
    throw new Error("Fallo en el reconocimiento de imagen con Gemini.");
  }
}