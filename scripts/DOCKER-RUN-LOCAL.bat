@echo off
title Docker Local Deploy
color 0C
cls

set ROOT=%~dp0..

echo.
echo  =====================================================
echo   DOCKER LOCAL DEPLOY
echo   (Requires Docker Desktop to be installed)
echo  =====================================================
echo.

docker --version > nul 2>&1
if errorlevel 1 (
    echo  ERROR: Docker is not installed!
    echo  Download from: https://www.docker.com/products/docker-desktop
    echo  Install it, restart PC, then run this again.
    pause
    exit /b 1
)

echo  Docker found! Building and starting containers...
echo.

cd /d "%ROOT%"
docker compose -f docker/docker-compose.yml down
docker compose -f docker/docker-compose.yml build --no-cache
docker compose -f docker/docker-compose.yml up -d

echo.
echo  Waiting for containers to start...
timeout /t 10 /nobreak > nul

start "" "http://localhost:80"

echo.
echo  =====================================================
echo   LIVE at http://localhost
echo   Admin: admin@interviewprep.com / Admin@123
echo.
echo   To stop: docker compose -f docker/docker-compose.yml down
echo  =====================================================
echo.
pause
