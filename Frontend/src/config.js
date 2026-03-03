// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'https://generaacionsoftware.onrender.com';

export default {
  API_URL,
  NEWS_ENDPOINT: `${API_URL}/api/news`,
};
