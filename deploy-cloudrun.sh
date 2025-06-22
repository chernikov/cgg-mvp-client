#!/bin/bash

# === CONFIGURATION ===
PROJECT_ID="cgg-v1"
REGION="us-central1"
SERVICE_NAME="nextjs-ssr"            # <-- CHANGE THIS if you want a different service name

# === AUTHENTICATION ===
echo "Authenticating with Google Cloud..."
gcloud auth login || exit 1
gcloud config set project $PROJECT_ID
gcloud config set run/region $REGION

# === BUILD AND DEPLOY TO CLOUD RUN ===
echo "Building Docker image and deploying to Cloud Run..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME || exit 1

gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated || exit 1

# === UPDATE firebase.json ===
echo "Updating firebase.json for Cloud Run proxy..."
cat > firebase.json <<EOL
{
  "hosting": {
    "public": ".next/static",
    "rewrites": [
      {
        "source": "**",
        "run": {
          "serviceId": "$SERVICE_NAME",
          "region": "$REGION"
        }
      }
    ]
  }
}
EOL

# === DEPLOY STATIC ASSETS TO FIREBASE HOSTING ===
echo "Deploying static assets to Firebase Hosting..."
firebase deploy --only hosting || exit 1

echo "Deployment complete!"
echo "Your SSR app is now live via Firebase Hosting and Cloud Run." 