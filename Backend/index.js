const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); 
const conectarDB = require('./src/config/db');
const newsRoutes = require('./src/routes/newsRoutes');

// Conectar a la base de datos
conectarDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "https://generaacion-software.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    // Permite requests sin origin (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    return callback(new Error("CORS: Origen no permitido: " + origin));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/news', newsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Servidor funcionando correctamente' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ message: err.message });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📡 CORS habilitado para:`);
  console.log(`   - http://localhost:5173`);
  console.log(`   - http://localhost:5174`);
  console.log(`   - http://localhost:5175`);
  console.log(`   - http://localhost:3000`);
  console.log(`📁 Archivos estáticos en /uploads`);
});