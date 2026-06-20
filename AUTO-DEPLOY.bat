@echo off
title AUTO DEPLOY - AI Interview Platform
color 0B
cls

echo.
echo  ========================================
echo   AUTO DEPLOY - AI Interview Platform
echo  ========================================
echo.
echo  This will automatically:
echo  [1] Setup Git repository
echo  [2] Open GitHub for you to create repo
echo  [3] Open Render for deployment
echo  [4] Give you live link
echo.
echo  Press ENTER to start auto deployment...
pause >nul

REM Initialize Git
echo [1] Setting up Git...
git init >nul 2>&1
git add . >nul 2>&1
git commit -m "Auto deploy: AI Interview Platform" >nul 2>&1
git branch -M main >nul 2>&1

echo [2] Opening GitHub to create repository...
start "" "https://github.com/new?name=ai-interview-prep&description=AI+Interview+Preparation+Platform&visibility=public"

echo.
echo  ================================================
echo   STEP 1: CREATE REPO (30 seconds)
echo  ================================================
echo   GitHub opened in browser. Just:
echo   1. Click "Create repository" (everything is pre-filled)
echo   2. Copy the HTTPS clone URL
echo   3. Come back here and paste it
echo.
set /p REPO_URL="Paste your GitHub repository URL here: "

echo.
echo [3] Connecting to GitHub...
git remote add origin %REPO_URL% >nul 2>&1
echo [4] Pushing code...
git push -u origin main

echo.
echo [5] Opening Render for auto-deployment...
start "" "https://render.com/select-repo?type=blueprint"

echo.
echo  ================================================
echo   STEP 2: AUTO DEPLOY (1 minute)
echo  ================================================
echo   Render opened in browser. Just:
echo   1. Login with GitHub
echo   2. Select your repo: ai-interview-prep
echo   3. Click "Apply"
echo.
echo   YOUR LIVE URLS (ready in 10 minutes):
echo   Frontend: https://ai-interview-prep-frontend.onrender.com
echo   Backend:  https://ai-interview-prep-backend.onrender.com
echo.
echo   ADMIN LOGIN:
echo   Email: admin@interviewprep.com
echo   Password: Admin@123
echo.
echo  ================================================
echo   DONE! Your app is deploying automatically!
echo  ================================================
echo.
pause