@echo off
title Backend - Spring Boot
color 0A
cd /d "C:\Users\PAVULURISAIMOHITH\OneDrive\Desktop\AI Interview Preparation Platform\backend"
echo.
echo  Starting Spring Boot Backend on port 8080...
echo  H2 Database Console: http://localhost:8080/h2-console
echo.
mvn spring-boot:run -Dspring-boot.run.profiles=h2
pause
