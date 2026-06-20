@echo off
title DEPLOY TO LIVE - AI Interview Prep Platform
color 0A
cls

echo.
echo  =====================================================
echo   DEPLOYING AI INTERVIEW PREP PLATFORM TO LIVE
echo  =====================================================
echo.

REM Check if Git is installed
git --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ERROR: Git is not installed!
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    pause
    exit /b 1
)

echo [1] Initializing Git repository...
git init
git add .
git commit -m "Initial deployment: AI Interview Preparation Platform"

echo.
echo [2] YOU NEED TO CREATE A GITHUB REPOSITORY:
echo.
echo    1. Go to: https://github.com/new
echo    2. Repository name: ai-interview-prep-platform
echo    3. Make it PUBLIC
echo    4. Click "Create repository"
echo    5. Copy the repository URL (like: https://github.com/USERNAME/ai-interview-prep-platform.git)
echo.
set /p REPO_URL="Enter your GitHub repository URL: "

if "%REPO_URL%"=="" (
    echo ERROR: Repository URL is required!
    pause
    exit /b 1
)

echo.
echo [3] Adding GitHub remote and pushing...
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to push to GitHub!
    echo Make sure:
    echo - Repository URL is correct
    echo - You're logged into Git (run: git config --global user.name "Your Name")
    echo - You have push permissions
    pause
    exit /b 1
)

echo.
echo [4] SUCCESS! Code pushed to GitHub.
echo.
echo NOW DEPLOY ON RENDER:
echo.
echo    1. Go to: https://render.com
echo    2. Sign up/Login with GitHub
echo    3. Click "New +" then "Blueprint"
echo    4. Connect your GitHub account
echo    5. Select repository: ai-interview-prep-platform
echo    6. Click "Apply"
echo.
echo    Your live URLs will be:
echo    Frontend: https://ai-interview-prep-frontend.onrender.com
echo    Backend:  https://ai-interview-prep-backend.onrender.com
echo.
echo    Default admin login:
echo    Email: admin@interviewprep.com
echo    Password: Admin@123
echo.

start "" "https://render.com"
start "" "https://github.com/new"

echo Opening GitHub and Render in your browser...
echo.
pause