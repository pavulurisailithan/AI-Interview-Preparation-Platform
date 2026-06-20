@echo off
title AI Interview Preparation Platform
color 0A
cls

set ROOT=%~dp0..
set JAR=%ROOT%\backend\target\interview-prep-backend-1.0.0.jar

echo.
echo  =====================================================
echo   AI Interview Preparation Platform - LOCAL RUN
echo  =====================================================
echo.

echo  [1] Clearing ports 8080 and 3000...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak > nul

echo  [2] Checking backend JAR...
if not exist "%JAR%" (
    echo  Building backend JAR (first time only, ~2 min)...
    cd /d "%ROOT%\backend"
    mvn package -DskipTests -q
)

echo  [3] Checking frontend packages...
if not exist "%ROOT%\frontend\node_modules" (
    echo  Installing frontend packages (first time only)...
    cd /d "%ROOT%\frontend"
    npm install
)

echo  [4] Starting Backend...
start "BACKEND" cmd /k "color 0B && title BACKEND && java -jar -Dspring.profiles.active=h2 "%JAR%""
echo  Waiting 20 seconds for backend...
timeout /t 20 /nobreak > nul

echo  [5] Starting Frontend...
start "FRONTEND" cmd /k "color 0E && title FRONTEND && cd /d "%ROOT%\frontend" && npm run dev"
timeout /t 5 /nobreak > nul

start "" "http://localhost:3000"

echo.
echo  =====================================================
echo   LIVE at http://localhost:3000
echo   Admin: admin@interviewprep.com / Admin@123
echo  =====================================================
echo.
echo  Press any key to STOP all servers...
pause > nul

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
echo  Stopped. Bye!
timeout /t 2 /nobreak > nul
