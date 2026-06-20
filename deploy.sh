#!/bin/bash

echo "🚀 Deploying AI Interview Preparation Platform..."

# Build frontend
echo "📦 Building frontend..."
cd frontend
npm install
npm run build

# Commit and push changes
cd ..
git add .
git commit -m "Deploy: Add deployment configuration and build frontend"
git push origin main

echo "✅ Deployment files created!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://railway.app and connect your GitHub repo"
echo "2. Deploy backend on Railway (free tier available)"
echo "3. Go to https://vercel.com and import your GitHub repo" 
echo "4. Deploy frontend on Vercel (free tier available)"
echo "5. Update VITE_API_URL in vercel.json with your Railway backend URL"
echo ""
echo "🌐 Your app will be live at:"
echo "   Frontend: https://your-app.vercel.app"
echo "   Backend API: https://your-app.up.railway.app"