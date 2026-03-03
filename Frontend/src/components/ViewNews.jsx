import { useState, useEffect } from 'react';
import './ViewNews.css';
import config from '../config';

const API_URL = config.API_URL;

const ViewNews = ({ refreshTrigger }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  useEffect(() => {
    fetchNews();
  }, [refreshTrigger]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/news`);
      if (!response.ok) throw new Error('Error al obtener noticias');
      const data = await response.json();
      setNews(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudo conectar');
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const ext = filename.split('.').pop().toLowerCase();
    return imageExtensions.includes(ext);
  };

  const getImageUrl = (filename) => {
    return `${API_URL}/uploads/${filename}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Cargando noticias...</p>
      </div>
    );
  }

  return (
    <div className="newspaper-container">
      {error && (
        <div style={{ padding: '1rem', background: '#ffebee', color: '#c62828', margin: '1rem' }}>
          {error}
        </div>
      )}

      {news.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center' }}>
          <h3>Sin noticias</h3>
          <p>No hay noticias que mostrar. ¡Crea una nueva!</p>
        </div>
      ) : (
        <>
          <div className="newspaper-header">
            <h1>NOTICIAS HOY</h1>
            <p className="newspaper-date">{formatDate(new Date())}</p>
          </div>

          {/* Grid de todas las noticias */}
          <div className="news-grid-newspaper">
            <div className="articles-grid">
              {news.map((item) => (
                <div key={item._id} className="news-article" onClick={() => setSelectedNewsId(item._id)}>
                  {/* Imagen de la noticia */}
                  <div className="article-image-container">
                    {item.files && item.files.some(f => isImageFile(f.filename)) ? (
                      <img
                        src={getImageUrl(item.files.find(f => isImageFile(f.filename)).filename)}
                        alt={item.title}
                        className="article-image"
                      />
                    ) : (
                      <div className="no-image-small">📰</div>
                    )}
                  </div>

                  <div className="article-content">
                    <h3>{item.title}</h3>
                    <p className="article-date">{formatDate(item.createdAt)}</p>
                    <p className="article-description">
                      {item.description.substring(0, 120)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal para vista completa */}
      {selectedNewsId && (
        <div className="modal-overlay" onClick={() => setSelectedNewsId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedNewsId(null)}>✕</button>
            {news
              .filter((item) => item._id === selectedNewsId)
              .map((item) => (
                <div key={item._id} className="full-article">
                  {item.files && item.files.some(f => isImageFile(f.filename)) && (
                    <div className="full-article-image">
                      <img
                        src={getImageUrl(item.files.find(f => isImageFile(f.filename)).filename)}
                        alt={item.title}
                      />
                    </div>
                  )}
                  <h2>{item.title}</h2>
                  <p className="full-article-date">{formatDate(item.createdAt)}</p>
                  <p className="full-article-description">{item.description}</p>

                  {item.files && item.files.length > 0 && (
                    <div className="full-article-attachments">
                      <h4>Archivos adjuntos:</h4>
                      <div className="attachments-list">
                        {item.files.map((file, idx) => (
                          <a
                            key={idx}
                            href={`${API_URL}/uploads/${file.filename}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="attachment-link"
                          >
                            📎 {file.originalname}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewNews;
