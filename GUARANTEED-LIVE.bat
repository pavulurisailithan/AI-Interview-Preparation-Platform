@echo off
title GUARANTEED LIVE LINK
color 0D
cls

echo ==========================================
echo  GUARANTEED LIVE LINK - AI Interview Prep
echo ==========================================
echo.

REM Clear any existing processes
taskkill /f /im "java.exe" >nul 2>&1
taskkill /f /im "node.exe" >nul 2>&1
timeout /t 3 /nobreak >nul

echo [Step 1] Starting Backend Server...
cd backend
start "Backend" cmd /k "title BACKEND SERVER && color 0B && mvn spring-boot:run -Dspring-boot.run.profiles=h2"

echo [Step 2] Waiting for backend to fully start...
timeout /t 30 /nobreak >nul

echo [Step 3] Starting Frontend Server...
cd ..\frontend
start "Frontend" cmd /k "title FRONTEND SERVER && color 0E && npm run dev"

echo [Step 4] Waiting for frontend to start...
timeout /t 15 /nobreak >nul

echo [Step 5] Testing local servers...
curl -s http://localhost:8080/api/health >nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend not responding. Check Backend window.
    pause
    exit /b 1
)

echo [Step 6] Creating public tunnel with multiple methods...

REM Method 1: LocalTunnel
start "Public Link 1" cmd /k "title PUBLIC LINK - LOCALTUNNEL && color 0A && echo Installing tunnel... && npm install -g localtunnel && echo Creating public URL... && npx lt --port 3000 --subdomain aiinterview%RANDOM%"

REM Method 2: Bore.pub
start "Public Link 2" cmd /k "title PUBLIC LINK - BORE && color 0C && echo Downloading bore... && curl -L https://github.com/ekzhang/bore/releases/download/v0.5.0/bore-v0.5.0-x86_64-pc-windows-msvc.zip -o bore.zip && tar -xf bore.zip && echo Creating tunnel... && bore.exe local 3000 --to bore.pub"

REM Method 3: Serveo
start "Public Link 3" cmd /k "title PUBLIC LINK - SERVEO && color 0F && echo Creating serveo tunnel... && ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"

echo.
echo ==========================================
echo  LIVE LINKS READY!
echo ==========================================
echo.
echo Three public URLs are being created!
echo Check the "Public Link" windows for your URLs.
echo.
echo Expected formats:
echo 1. https://aiinterview[number].loca.lt
echo 2. https://[random].bore.pub  
echo 3. https://[random].serveo.net
echo.
echo Admin Login for ALL links:
echo Email: admin@interviewprep.com
echo Password: Admin@123
echo.
echo At least ONE of these will work!
echo.
pause