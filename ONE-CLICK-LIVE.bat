
@echo off
title ONE-CLICK LIVE LINK
color 0A
cls

echo ==========================================
echo  ONE-CLICK LIVE LINK - AI Interview Prep
echo ==========================================
echo.
echo This will give you a public URL instantly!
echo Just press ENTER and wait 30 seconds...
echo.
pause

echo [1] Starting backend server...
cd backend
start "Backend" cmd /c "mvn spring-boot:run -Dspring-profiles.active=h2"

echo [2] Waiting for backend to load...
timeout /t 20 /nobreak >nul

echo [3] Starting frontend server...
cd ..\frontend
start "Frontend" cmd /c "npm install && npm run dev"

echo [4] Waiting for frontend to load...
timeout /t 15 /nobreak >nul

echo [5] Installing public tunnel...
npm install -g @ngrok/ngrok >nul 2>&1

echo [6] Creating your PUBLIC LIVE LINK...
start "Live Link" cmd /k "echo YOUR LIVE URL WILL APPEAR HERE && npx ngrok http 3000"

echo.
echo ==========================================
echo  SUCCESS! Your app is going live now!
echo ==========================================
echo.
echo Look at the "Live Link" window that opened.
echo Your PUBLIC URL will appear there in 10 seconds!
echo.
echo Share that URL with anyone in the world!
echo.
echo Admin Login:
echo Email: admin@interviewprep.com
echo Password: Admin@123
echo.
echo Press any key to close...
pause >nul