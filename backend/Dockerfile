# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy only package files first (to optimize caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy project files
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Run the app in a lightweight environment
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

# Expose port 3000 for Next.js
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
