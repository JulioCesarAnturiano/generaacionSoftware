import { useState, useEffect } from 'react';
import './NewsList.css';
import config from '../config';

const API_URL = config.API_URL;

const NewsList = ({ refreshTrigger }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNews();
  }, [refreshTrigger]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log('📡 Obteniendo noticias desde:', `${API_URL}/api/news`);

      const response = await fetch(`${API_URL}/api/news`);
      if (!response.ok) throw new Error('Error al obtener noticias');
      const data = await response.json();
      setNews(data);
      setError('');
    } catch (err) {
      console.error('❌ Error al obtener noticias:', err);
      if (err.message === 'Failed to fetch') {
        setError('⚠️ No se puede conectar al servidor. Verifica que esté corriendo en http://localhost:3000');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      try {
        const response = await fetch(`${API_URL}/api/news/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar');
        setNews(news.filter((n) => n._id !== id));
      } catch (err) {
        console.error('❌ Error al eliminar:', err);
        setError(err.message);
      }
    }
  };

  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('pdf')) return '📕';
    if (mimetype?.includes('image')) return '🖼️';
    return '📄';
  };

  if (loading) {
    return <div className="loading">Cargando noticias...</div>;
  }

  return (
    <div className="news-list-container">
      <h2>Noticias</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {news.length === 0 ? (
        <div className="empty-state">
          <p>No hay noticias aún. ¡Crea una nueva!</p>
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <div key={item._id} className="news-card">
              <div className="news-header">
                <h3>{item.title}</h3>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item._id)}
                  title="Eliminar noticia"
                >
                  🗑️
                </button>
              </div>

              <p className="news-description">{item.description}</p>

              <div className="news-date">
                📅 {new Date(item.createdAt).toLocaleDateString('es-ES')}
              </div>

              {item.files && item.files.length > 0 && (
                <div className="files-section">
                  <p className="files-title">Archivos:</p>
                  <div className="files-grid">
                    {item.files.map((file) => (
                      <div key={file._id} className="file-item">
                        <span className="file-icon">{getFileIcon(file.mimetype)}</span>
                        <a
                          href={`${API_URL}/${file.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          download
                          className="file-link"
                        >
                          {file.originalname}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;
