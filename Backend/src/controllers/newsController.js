const News = require('../models/News');
const fs = require('fs');
const path = require('path');

// Obtener todas las noticias
const getAllNews = async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener una noticia por ID
const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva noticia con archivos
const createNews = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Título y descripción son requeridos' });
    }

    const files = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        files.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
        });
      });
    }

    const newNews = new News({
      title,
      description,
      files,
    });

    const savedNews = await newNews.save();
    console.log('✅ Noticia creada:', savedNews._id);
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('❌ Error al crear noticia:', error);
    // Eliminar archivos si hay error
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error al eliminar archivo:', err);
        });
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Actualizar noticia
const updateNews = async (req, res) => {
  try {
    const { title, description } = req.body;
    const news = await News.findById(req.params.id);

    if (!news) {
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          fs.unlink(file.path, (err) => {
            if (err) console.error('Error al eliminar archivo:', err);
          });
        });
      }
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    if (title) news.title = title;
    if (description) news.description = description;

    // Agregar nuevos archivos si existen
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        news.files.push({
          filename: file.filename,
          originalname: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
        });
      });
    }

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (error) {
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error al eliminar archivo:', err);
        });
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Eliminar noticia
const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    // Eliminar archivos asociados
    if (news.files && news.files.length > 0) {
      news.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error al eliminar archivo:', err);
        });
      });
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Descargar archivo
const downloadFile = async (req, res) => {
  try {
    const { newsId, fileId } = req.params;
    const news = await News.findById(newsId);

    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' });
    }

    const file = news.files.id(fileId);
    if (!file) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    res.download(file.path, file.originalname);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  downloadFile,
};
