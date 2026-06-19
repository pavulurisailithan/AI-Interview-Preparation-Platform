@echo off
title AI Interview Preparation Platform
color 0A
cls

echo.
echo  =====================================================
echo   AI Interview Preparation Platform
echo  =====================================================
echo.

set ROOT=%~dp0
set JAR=%ROOT%backend\target\interview-prep-backend-1.0.0.jar

REM ── Kill anything on port 8080 or 3000 ──
echo  [STEP 1] Clearing ports...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
timeout /t 2 /nobreak > nul
echo  [STEP 1] Ports cleared OK.
echo.

REM ── Check JAR exists ──
if not exist "%JAR%" (
    echo  [STEP 2] Building backend JAR (one-time, takes 1-2 min)...
    cd /d "%ROOT%backend"
    mvn package -DskipTests -q
    echo  [STEP 2] Build done!
) else (
    echo  [STEP 2] Backend JAR found OK.
)
echo.

REM ── Install frontend if needed ──
if not exist "%ROOT%frontend\node_modules" (
    echo  [STEP 3] Installing frontend packages (one-time)...
    cd /d "%ROOT%frontend"
    npm install
    echo  [STEP 3] Done!
) else (
    echo  [STEP 3] Frontend packages OK.
)
echo.

REM ── Start Backend via java -jar (stable, never exits) ──
echo  [STEP 4] Starting Backend...
start "BACKEND - Spring Boot" cmd /k "color 0B && title BACKEND && java -jar -Dspring.profiles.active=h2 "%JAR%""
echo  Waiting 20 seconds for backend to start...
timeout /t 20 /nobreak > nul
echo  [STEP 4] Backend started!
echo.

REM ── Start Frontend ──
echo  [STEP 5] Starting Frontend...
start "FRONTEND - Vite" cmd /k "color 0E && title FRONTEND && cd /d "%ROOT%frontend" && npm run dev"
echo  Waiting 5 seconds for frontend...
timeout /t 5 /nobreak > nul
echo  [STEP 5] Frontend started!
echo.

REM ── Open browser ──
start "" "http://localhost:3000"

echo  =====================================================
echo.
echo   RUNNING at http://localhost:3000
echo.
echo   LOGIN (Admin):
echo     Email    :  admin@interviewprep.com
echo     Password :  Admin@123
echo.
echo   OR register any new account with any email/password
echo.
echo  =====================================================
echo.
echo  Press any key to STOP all servers...
pause > nul

for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":8080 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do taskkill /PID %%a /F >nul 2>&1
echo  Stopped. Bye!
timeout /t 2 /nobreak > nul
