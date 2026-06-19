@echo off
title AI Interview Prep - Backend (Spring Boot + MySQL)
echo ==========================================
echo  Backend: Spring Boot + MySQL
echo  URL: http://localhost:8080
echo ==========================================
echo.
echo NOTE: Make sure MySQL is running on port 3306
echo       Update password in: backend\src\main\resources\application.properties
echo       OR run with H2 (no MySQL): mvn spring-boot:run -Dspring-boot.run.profiles=h2
echo.
cd /d "%~dp0backend"
mvn spring-boot:run
pause
