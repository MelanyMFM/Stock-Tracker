const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
const BASE_URL = "https://www.alphavantage.co/query";

/**
 * Obtiene el precio actual de una acción.
 * @param {string} symbol - El símbolo del ticker (ej: AAPL, TSLA, MSFT)
 * @returns {Promise<number|null>} Precio actual o null si hay error
 */
export async function getStockPrice(symbol) {
  try {
    const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    // Estructura de respuesta: { "Global Quote": { "05. price": "123.45" } }
    const price = data["Global Quote"]?.["05. price"];
    return price ? parseFloat(price) : null;
  } catch (error) {
    console.error("Error al obtener precio:", error);
    return null;
  }
}
