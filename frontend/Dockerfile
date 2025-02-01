# Use an official Node.js runtime as a base image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, pnpm-lock.yaml)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Build the Next.js application
RUN npm run build

# -- Production Image --
FROM node:18-alpine AS runner

WORKDIR /app

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
