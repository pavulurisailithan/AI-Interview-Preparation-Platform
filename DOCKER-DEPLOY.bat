@echo off
echo 🚀 Building and Deploying AI Interview Platform with Docker...

echo 📦 Building Docker containers...
docker-compose down
docker-compose build --no-cache

echo 🎯 Starting services...
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 10

echo 🌐 Your application is now LIVE at:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:8080
echo    Health Check: http://localhost:8080/api/auth/health

echo.
echo 📋 To deploy online (FREE):
echo 1. Go to https://render.com
echo 2. Connect your GitHub repo  
echo 3. Your live links will be:
echo    - Frontend: https://ai-interview-prep-frontend.onrender.com
echo    - Backend: https://ai-interview-prep-backend.onrender.com

echo.
echo 🔍 Check status:
docker-compose ps

echo.
echo 📊 View logs:
echo    docker-compose logs backend
echo    docker-compose logs frontend

pause