FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./  # Copy package files first
RUN npm install --omit=dev

COPY frontend/src/app ./       # Explicitly copy the app directory
COPY frontend/public ./      # Explicitly copy the public directory
# ... other COPY commands as needed

RUN npm run build

# ... rest of your multi-stage Dockerfile