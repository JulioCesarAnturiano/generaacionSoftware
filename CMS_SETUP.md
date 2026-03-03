# 📰 CMS de Noticias - Guía de Instalación

Un Content Management System simple para crear y gestionar noticias con soporte para imágenes y PDFs.

## 🚀 Características

- ✅ Crear noticias con título y descripción
- 📸 Subir imágenes (JPG, PNG, GIF)
- 📄 Subir archivos PDF
- 🗑️ Eliminar noticias
- 📅 Visualizar fecha de creación
- 🎯 Interfaz simple y moderna

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o conexión a cloud como MongoDB Atlas)
- npm o yarn

## 🔧 Instalación

### 1. Configurar el Backend

```bash
cd Backend
npm install
```

Crea un archivo `.env` en la carpeta `Backend` con el siguiente contenido:

```
MONGODB_URI=mongodb://localhost:27017/cms
PORT=3000
```

> **Nota:** Si usas MongoDB Atlas, reemplaza la URI con tu cadena de conexión.

### 2. Configurar el Frontend

```bash
cd Frontend
npm install
```

## ▶️ Ejecutar la Aplicación

### Terminal 1 - Backend

```bash
cd Backend
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`

### Terminal 2 - Frontend

```bash
cd Frontend
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 📖 Cómo Usar

1. **Crear una Noticia:**
   - Completa el formulario con:
     - Título de la noticia
     - Descripción detallada
     - Selecciona archivos (imágenes o PDF)
   - Haz clic en "➕ Crear Noticia"

2. **Ver Noticias:**
   - Las noticias aparecerán automáticamente en la sección "Noticias"
   - Puedes ver la fecha de creación y los archivos adjuntos

3. **Descargar Archivos:**
   - Haz clic en el nombre del archivo para descargar

4. **Eliminar una Noticia:**
   - Haz clic en el botón 🗑️ en la esquina superior derecha de la noticia

## 📁 Estructura de Archivos

```
Backend/
├── src/
│   ├── models/
│   │   └── News.js (Modelo de noticias)
│   ├── controllers/
│   │   └── newsController.js (Lógica de negocio)
│   ├── routes/
│   │   └── newsRoutes.js (Rutas API)
│   └── config/
│       └── db.js (Configuración BD)
├── uploads/ (Carpeta para archivos)
├── index.js
└── package.json

Frontend/
├── src/
│   ├── components/
│   │   ├── NewsForm.jsx (Formulario)
│   │   ├── NewsForm.css
│   │   ├── NewsList.jsx (Lista de noticias)
│   │   └── NewsList.css
│   ├── App.jsx
│   └── App.css
└── package.json
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/news` | Obtener todas las noticias |
| GET | `/api/news/:id` | Obtener una noticia |
| POST | `/api/news` | Crear noticia (con archivos) |
| PUT | `/api/news/:id` | Actualizar noticia |
| DELETE | `/api/news/:id` | Eliminar noticia |
| GET | `/api/news/:newsId/download/:fileId` | Descargar archivo |

## ⚙️ Configuración de Archivos

- **Tipos permitidos:** JPEG, PNG, GIF, PDF
- **Tamaño máximo:** 10MB por archivo
- **Cantidad máxima:** 5 archivos por noticia

## 🛠️ Solucionar Problemas

### Error: "Cannot find module 'multer'"
```bash
cd Backend
npm install
```

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté corriendo localmente o que la URI en `.env` sea correcta

### Error: "CORS policy error"
- Asegúrate de que el backend está corriendo en `http://localhost:3000`
- Verifica que CORS está habilitado en `Backend/index.js`

### Los archivos no se suben
- Verifica que la carpeta `Backend/uploads` existe
- Comprueba permisos de escritura en la carpeta

## 📝 Notas Adicionales

- Los archivos se guardan en la carpeta `Backend/uploads`
- Las noticias se almacenan en MongoDB
- El frontend se conecta al backend en `http://localhost:3000`

---

¡Listo! Tu CMS está funcionando. 🎉
