// Configuración de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default {
  API_URL,
  NEWS_ENDPOINT: `${API_URL}/api/news`,
};
