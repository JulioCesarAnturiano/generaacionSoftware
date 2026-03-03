#!/bin/bash
# Script para instalar dependencias e iniciar la aplicación

echo "📦 Instalando dependencias del Backend..."
cd Backend
npm install

echo "📦 Instalando dependencias del Frontend..."
cd ../Frontend
npm install

echo ""
echo "✅ Dependencias instaladas correctamente"
echo ""
echo "🚀 Para ejecutar la aplicación:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd Backend"
echo "  npm run dev"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd Frontend"
echo "  npm run dev"
echo ""
echo "🌐 La aplicación estará disponible en: http://localhost:5173"
