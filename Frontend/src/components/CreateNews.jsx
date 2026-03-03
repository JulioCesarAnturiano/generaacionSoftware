import { useState } from 'react';
import './CreateNews.css';
import config from '../config';

const API_URL = config.API_URL;

const CreateNews = ({ onNewsCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    files: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fileNames, setFileNames] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFormData({ ...formData, files: selectedFiles });
    setFileNames(selectedFiles.map(f => f.name));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }

    if (formData.files.length === 0) {
      setError('Debe seleccionar al menos un archivo (imagen o PDF)');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      formData.files.forEach(file => {
        data.append('files', file);
      });

      const response = await fetch(`${API_URL}/api/news`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la noticia');
      }

      setSuccess('Noticia creada exitosamente');
      setFormData({ title: '', description: '', files: [] });
      setFileNames([]);
      setTimeout(() => {
        onNewsCreated();
      }, 1000);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-news-container">
      <div className="create-news-card">
        <h2>Crear Nueva Noticia</h2>

        {error && <div style={{padding: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', marginBottom: '1rem'}}>{error}</div>}
        {success && <div style={{padding: '1rem', background: '#e8f5e9', color: '#2e7d32', borderRadius: '4px', marginBottom: '1rem'}}>{success}</div>}

        <form onSubmit={handleSubmit} className="news-form">
          <div className="form-group">
            <label htmlFor="title">Título</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ingresa el título de la noticia"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Ingresa la descripción completa"
              rows="6"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="files">Archivos</label>
            <div className="file-upload">
              <input
                type="file"
                id="files"
                multiple
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.gif,.pdf"
                disabled={loading}
              />
              <label htmlFor="files" className="file-upload-label">
                <span>Haz clic para seleccionar archivos</span>
                <small>Soporta: JPG, PNG, GIF, PDF</small>
              </label>
            </div>

            {fileNames.length > 0 && (
              <div className="file-list">
                <p className="file-count">Archivos: {fileNames.length}</p>
                <ul>
                  {fileNames.map((name, idx) => (
                    <li key={idx}>✓ {name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Noticia'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateNews;
