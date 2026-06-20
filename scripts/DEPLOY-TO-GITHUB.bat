@echo off
title Deploy to GitHub - Render Auto Deploy
color 0D
cls

set ROOT=%~dp0..

echo.
echo  =====================================================
echo   DEPLOY to GitHub (Render auto-deploys from this)
echo  =====================================================
echo.

echo  [1] Building frontend...
cd /d "%ROOT%\frontend"
call npm install
call npm run build
if errorlevel 1 (
    echo  ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo  Frontend build OK!
echo.

echo  [2] Pushing to GitHub...
cd /d "%ROOT%"
git add .
git commit -m "Deploy: updated build"
git push origin main
if errorlevel 1 (
    echo  ERROR: Git push failed! Check your GitHub credentials.
    pause
    exit /b 1
)

echo.
echo  =====================================================
echo   SUCCESS! Pushed to GitHub.
echo.
echo   Render will auto-deploy in ~5 minutes.
echo   Your live links:
echo     Frontend : https://ai-interview-prep-frontend.onrender.com
echo     Backend  : https://ai-interview-prep-backend.onrender.com
echo.
echo   First time? Go to https://render.com
echo   Sign in with GitHub, click New+ > Blueprint
echo   Select your repo and click Apply.
echo  =====================================================
echo.
pause
