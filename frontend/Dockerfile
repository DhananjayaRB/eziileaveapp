# ====== Stage 1: Build Stage ======
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy all application files
COPY . .

# Build Next.js app
RUN npm run build

# ====== Stage 2: Runtime Stage ======
FROM node:18-alpine AS runtime

WORKDIR /app

# Copy built files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose Next.js port
EXPOSE 3000

# Run Next.js in production mode
CMD ["npm", "run", "dev"]
