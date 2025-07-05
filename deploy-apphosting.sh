#!/bin/bash

# ============================================================================
# DEPLOYMENT SCRIPT FOR CAREER GUIDANCE GUILD (CGG) TO FIREBASE APP HOSTING
# ============================================================================
# Цей скрипт деплоїть Next.js застосунок через Firebase App Hosting
# App Hosting автоматично використовує Cloud Run за лаштунками для SSR

# === CONFIGURATION ===
PROJECT_ID="cgg-v1"              # ID Firebase проекту
BACKEND_ID="cgg-be"              # ID App Hosting backend

# === AUTHENTICATION ===
echo "🔐 Setting up Firebase project..."
firebase use $PROJECT_ID || exit 1

echo "📋 Current configuration:"
echo "Firebase project: $(firebase use)"
echo "Backend ID: $BACKEND_ID"

# === BUILD APPLICATION ===
echo "🔨 Building Next.js application..."
npm run build || exit 1

# === DEPLOY TO FIREBASE APP HOSTING ===
echo "🚀 Deploying to Firebase App Hosting..."
echo "This will:"
echo "  1. Upload your code to Firebase"
echo "  2. Build Docker container automatically"
echo "  3. Deploy to Cloud Run via App Hosting"
echo "  4. Setup automatic HTTPS and CDN"

# Деплоймент через App Hosting
firebase deploy --only apphosting:$BACKEND_ID || exit 1

# === COMPLETION ===
echo "✅ Deployment complete!"
echo "🌐 Your SSR app is now live via Firebase App Hosting"
echo "📱 Backend URL: https://$BACKEND_ID--$PROJECT_ID.europe-west4.hosted.app"
echo "📱 Custom domain: https://careergg.com/ (if configured)"
echo ""
echo "🏗️ Architecture:"
echo "  Browser → Firebase App Hosting → Cloud Run (автоматично) → Next.js SSR"
