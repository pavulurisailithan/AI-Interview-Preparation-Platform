@echo off
title AI Interview Prep - Frontend (Vite + React)
echo ==========================================
echo  Frontend: Vite + React
echo  URL: http://localhost:3000
echo ==========================================
echo.
set "PATH=%PATH%;C:\Program Files\nodejs"
cd /d "%~dp0frontend"
npm run dev
pause
