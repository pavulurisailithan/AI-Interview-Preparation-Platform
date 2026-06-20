
@echo off
title INSTANT PUBLIC LINK
color 0C
cls

echo ==========================================
echo  INSTANT PUBLIC LINK - No Setup Required
echo ==========================================
echo.
echo This creates a public URL in 30 seconds!
echo Press ENTER to start...
pause

REM Kill any existing processes on these ports
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1

echo [1] Starting backend...
cd backend
start "Backend Server" cmd /c "color 0B && title BACKEND RUNNING && mvn spring-boot:run -Dspring-boot.run.profiles=h2"

echo [2] Starting frontend...
cd ..\frontend
start "Frontend Server" cmd /c "color 0E && title FRONTEND RUNNING && npm run dev"

echo [3] Waiting for servers to start...
timeout /t 25 /nobreak >nul

echo [4] Creating PUBLIC TUNNEL...
start "PUBLIC URL" cmd /k "color 0A && title YOUR PUBLIC LIVE URL && echo Connecting to public internet... && echo. && curl -s http://localhost:3000 >nul && echo SUCCESS! Your app is running locally. && echo Creating public tunnel... && echo. && ssh -o StrictHostKeyChecking=no -R 80:localhost:3000 serveo.net"

echo.
echo ==========================================
echo  YOUR APP IS NOW PUBLIC!
echo ==========================================
echo.
echo Check the "PUBLIC URL" window that opened.
echo Your live link will show there!
echo.
echo Format: https://RANDOM.serveo.net
echo.
echo Admin Login:
echo Email: admin@interviewprep.com  
echo Password: Admin@123
echo.
echo The link works worldwide instantly!
echo.
pause