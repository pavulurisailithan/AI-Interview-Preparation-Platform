@echo off
echo Starting AI Interview Preparation Platform...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

echo Starting backend server...
cd backend
start "Backend Server" cmd /c "mvn spring-boot:run -Dspring-boot.run.profiles=h2"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /c "npm install && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul