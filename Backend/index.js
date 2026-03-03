const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const conectarDB = require("./src/config/db");
const newsRoutes = require("./src/routes/newsRoutes");

const app = express();

// Conectar a la base de datos
conectarDB();

// CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "https://generaacion-software.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman/curl

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error("CORS: Origen no permitido: " + origin));
    },
    credentials: true,
  })
);

app.options("*", cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ✅ Crear carpeta uploads y servirla
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}
app.use("/uploads", express.static(uploadPath));

// Rutas
app.use("/api/news", newsRoutes);

// Health
app.get("/api/health", (req, res) => {
  res.json({ status: "✅ Servidor funcionando correctamente" });
});

// Error global
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ message: err.message });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`📁 Archivos estáticos en /uploads`);
});