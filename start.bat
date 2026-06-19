@echo off
title AI Interview Preparation Platform
echo ==========================================
echo   AI Interview Preparation Platform
echo ==========================================
echo.

set ROOT=%~dp0

echo [1/2] Starting Backend (Spring Boot with H2)...
start "Backend" cmd /k "cd /d "%ROOT%backend" && mvn spring-boot:run -Dspring-boot.run.profiles=h2"

echo Waiting 30 seconds for backend to start...
timeout /t 30 /nobreak > nul

echo [2/2] Starting Frontend (Vite)...
start "Frontend" cmd /k "cd /d "%ROOT%frontend" && npm run dev"

echo.
echo ==========================================
echo  Both servers starting!
echo.
echo  Frontend : http://localhost:3000
echo  Backend  : http://localhost:8080
echo  H2 DB    : http://localhost:8080/h2-console
echo.
echo  Login:
echo    Admin : admin@interviewprep.com / Admin@123
echo ==========================================
pause
