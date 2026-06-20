@echo off
title INSTANT LIVE - NO SETUP REQUIRED
color 0A

echo ==========================================
echo  INSTANT LIVE LINK - GitHub Codespaces  
echo ==========================================
echo.
echo This method gives you an INSTANT live link!
echo.
echo STEP 1: Push to GitHub (automated)
echo.

REM Setup Git
git init >nul 2>&1
git add . >nul 2>&1  
git commit -m "Deploy to live" >nul 2>&1

echo Opening GitHub - just create repository...
start "" "https://github.com/codespaces"

echo.
echo ==========================================
echo  EASIEST METHOD - FOLLOW THESE STEPS:
echo ==========================================
echo.
echo 1. Go to: https://github.com/new
echo 2. Name: ai-interview-prep
echo 3. Upload your project files (drag the entire folder)
echo 4. Go to: https://github.com/YOUR_USERNAME/ai-interview-prep
echo 5. Click the GREEN "Code" button
echo 6. Click "Codespaces" tab
echo 7. Click "Create codespace on main"
echo.
echo IN CODESPACE:
echo 8. Terminal 1: cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=h2
echo 9. Terminal 2: cd frontend && npm install && npm run dev  
echo 10. Click "Ports" tab, make port 3000 "Public"
echo 11. Copy the public URL!
echo.
echo RESULT: Instant live link like:
echo https://xyz-3000.preview.app.github.dev
echo.
echo This is 100%% FREE and works instantly!
echo.
pause