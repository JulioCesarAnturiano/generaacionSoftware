import { useState } from 'react';
import './NewsForm.css';
import config from '../config';

const API_URL = config.API_URL;

const NewsForm = ({ onNewsCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      setError('Por favor completa título y descripción');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      console.log('📤 Enviando formulario...', { title, description, filesCount: files.length });
      console.log('🔌 Conectando a:', `${API_URL}/api/news`);

      const response = await fetch(`${API_URL}/api/news`, {
        method: 'POST',
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Error al crear la noticia');
      }

      const newNews = responseData;
      setSuccess('✅ Noticia creada exitosamente!');
      setTitle('');
      setDescription('');
      setFiles([]);
      
      // Resetear input de archivos
      const fileInput = document.getElementById('files');
      if (fileInput) {
        fileInput.value = '';
      }
      
      if (onNewsCreated) {
        onNewsCreated(newNews);
      }

      // Limpiar mensaje de éxito
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('❌ Error completo:', err);
      
      let errorMessage = '';
      
      if (err.message === 'Failed to fetch') {
        errorMessage = `⚠️ No se puede conectar al servidor. Verifica que:\n1. El Backend esté corriendo en http://localhost:3000\n2. MongoDB esté corriendo\n3. No haya errores de puerto`;
      } else if (err instanceof TypeError) {
        errorMessage = `⚠️ Error de red: ${err.message}. El servidor no está disponible.`;
      } else {
        errorMessage = err.message || 'Hubo un error desconocido al crear la noticia.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-form-container">
      <h2>Crear Nueva Noticia</h2>
      
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ingresa el título de la noticia"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ingresa la descripción de la noticia"
            rows="5"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="files">Archivos (Imágenes o PDF)</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/gif,.pdf"
          />
          <small>Puedes seleccionar múltiples archivos • Máximo 10MB por archivo</small>
          {files.length > 0 && (
            <div className="files-list">
              <p>Archivos seleccionados:</p>
              <ul>
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? 'Creando...' : '➕ Crear Noticia'}
        </button>
      </form>
    </div>
  );
};

export default NewsForm;
