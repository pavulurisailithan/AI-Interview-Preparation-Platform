@echo off
title INSTANT LIVE LINK - AI Interview Platform
color 0E
cls

echo.
echo  ========================================
echo   INSTANT LIVE LINK (No GitHub needed)
echo  ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js not found!
    echo Install from: https://nodejs.org
    pause
    exit /b 1
)

echo [1] Installing tunnel service...
cd frontend
npm install -g localtunnel >nul 2>&1

echo [2] Starting backend...
cd ..\backend
start "Backend" cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=h2"

echo [3] Waiting for backend to start...
timeout /t 15 /nobreak >nul

echo [4] Starting frontend...
cd ..\frontend
start "Frontend" cmd /c "npm run dev"

echo [5] Waiting for frontend to start...
timeout /t 10 /nobreak >nul

echo [6] Creating public tunnel...
start "Tunnel" cmd /c "npx localtunnel --port 3000 --subdomain aiinterview%RANDOM%"

echo.
echo  ========================================
echo   LIVE LINK READY!
echo  ========================================
echo.
echo  Your app is now publicly accessible!
echo  The tunnel URL will appear in the Tunnel window.
echo.
echo  Admin Login:
echo  Email: admin@interviewprep.com
echo  Password: Admin@123
echo.
echo  Note: This link works as long as your computer is on.
echo.
pause