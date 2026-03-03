# Script para instalar dependencias e iniciar la aplicación en Windows

Write-Host "📦 Instalando dependencias del Backend..." -ForegroundColor Green

Set-Location Backend
npm install

Write-Host "📦 Instalando dependencias del Frontend..." -ForegroundColor Green

Set-Location ../Frontend
npm install

Write-Host ""
Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Para ejecutar la aplicación:" -ForegroundColor Cyan
Write-Host ""
Write-Host "Terminal 1 (Backend):" -ForegroundColor Yellow
Write-Host "  cd Backend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Terminal 2 (Frontend):" -ForegroundColor Yellow
Write-Host "  cd Frontend"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "🌐 La aplicación estará disponible en: http://localhost:5173" -ForegroundColor Cyan
