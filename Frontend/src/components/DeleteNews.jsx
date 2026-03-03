import { useState, useEffect } from 'react';
import './DeleteNews.css';
import config from '../config';

const API_URL = config.API_URL;

const DeleteNews = ({ refreshTrigger, onNewsDeleted }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState(false);

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
      setError('Error al cargar noticias');
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/news/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar');
      
      setNews(news.filter((n) => n._id !== id));
      setSelectedNews(null);
      setConfirmDelete(null);
      setExpandedDetails(false);
      onNewsDeleted?.();
    } catch (err) {
      console.error('Error al eliminar:', err);
      setError('Error al eliminar la noticia');
    }
  };

  const handleSelectNews = (item) => {
    setSelectedNews(item);
    setConfirmDelete(null);
    setExpandedDetails(false);
  };

  if (loading) {
    return <div style={{padding: '3rem', textAlign: 'center'}}>Cargando noticias...</div>;
  }

  return (
    <div className="delete-news-container">
      <h2>Gestionar Noticias</h2>

      {error && <div style={{padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem'}}>{error}</div>}

      {news.length === 0 ? (
        <div style={{padding: '3rem', textAlign: 'center'}}>
          <p>No hay noticias para eliminar</p>
        </div>
      ) : (
        <div className="delete-layout">
          <div className="news-list-delete">
            <h3>Noticias ({news.length})</h3>
            <div className="list-scroll">
              {news.map((item) => (
                <div
                  key={item._id}
                  className={`news-item-delete ${selectedNews?._id === item._id ? 'active' : ''}`}
                  onClick={() => handleSelectNews(item)}
                >
                  <div className="item-info">
                    <p className="item-title">{item.title}</p>
                    <p className="item-date">
                      {new Date(item.createdAt).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delete-preview">
            {selectedNews ? (
              <>
                <div className="preview-details">
                  <h3>{selectedNews.title}</h3>
                  <p className="preview-date">
                    Creado: {new Date(selectedNews.createdAt).toLocaleDateString('es-ES')}
                  </p>
                  <p className="preview-description">{selectedNews.description}</p>

                  {/* Botón para expandir detalles */}
                  <button 
                    className="btn-expand-details"
                    onClick={() => setExpandedDetails(!expandedDetails)}
                  >
                    {expandedDetails ? '▼ Ocultar detalles' : '▶ Ver detalles'}
                  </button>

                  {/* Detalles expandidos */}
                  {expandedDetails && selectedNews.files && selectedNews.files.length > 0 && (
                    <div className="expanded-files-section">
                      {/* Imagen si existe */}
                      {selectedNews.files.some(f => isImageFile(f.filename)) && (
                        <div className="preview-image-small">
                          <img
                            src={getImageUrl(selectedNews.files.find(f => isImageFile(f.filename)).filename)}
                            alt={selectedNews.title}
                          />
                        </div>
                      )}
                      
                      {/* Links de archivos discretos */}
                      <div className="discrete-files-list">
                        <p className="files-label">📎 Archivos:</p>
                        <div className="files-links">
                          {selectedNews.files.map((file, idx) => {
                            const isImage = isImageFile(file.filename);
                            return (
                              <a
                                key={idx}
                                href={getImageUrl(file.filename)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="file-link-discrete"
                                title={file.originalname}
                              >
                                {isImage ? '🖼️' : '📄'} {file.originalname}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {confirmDelete === selectedNews._id ? (
                    <div className="confirmation-box">
                      <p className="warning">
                        ¿Estás seguro de eliminar esta noticia? No se puede deshacer.
                      </p>
                      <div className="confirmation-buttons">
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(selectedNews._id)}
                        >
                          Sí, Eliminar
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => setConfirmDelete(null)}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="btn btn-danger btn-delete-large"
                      onClick={() => setConfirmDelete(selectedNews._id)}
                    >
                      Eliminar Esta Noticia
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="no-selection">
                <p>Selecciona una noticia para eliminarla</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteNews;
