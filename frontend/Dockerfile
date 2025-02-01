FROM node:18-alpine AS builder

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --omit=dev

COPY frontend/src/app ./
COPY frontend/public ./
# ... other COPY commands as needed

RUN npm run build

# ... rest of your multi-stage Dockerfile