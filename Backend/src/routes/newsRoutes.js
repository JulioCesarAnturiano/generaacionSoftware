const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  downloadFile,
} = require('../controllers/newsController');

const router = express.Router();

// Configurar multer para archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se aceptan JPG, PNG, GIF y PDF'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// Rutas
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.post('/', upload.array('files', 5), createNews);
router.put('/:id', upload.array('files', 5), updateNews);
router.delete('/:id', deleteNews);
router.get('/:newsId/download/:fileId', downloadFile);

module.exports = router;
