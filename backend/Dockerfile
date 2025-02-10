# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only package files first (to optimize caching)
COPY package.json package-lock.json ./

RUN npm install --frozen-lockfile

# Copy the full project files
COPY . .

# ✅ Build the Next.js app
RUN npm run build

# Stage 2: Run the app
FROM node:18-alpine

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000

# ✅ Ensure Next.js starts in production mode
CMD ["npm", "run", "start"]