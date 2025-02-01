# Use a Node.js base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if it exists)
COPY frontend/package*.json ./

# Install dependencies (using --omit=dev for production)
RUN npm install --omit=dev

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Create a smaller image for the final deployment (multi-stage build)
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public # If you have a public folder
COPY --from=builder /app/next.config.js ./ # If you have next.config.js
COPY --from=builder /app/ .env ./ # If you have .env file

# Set environment variables (if needed)
# ENV NODE_ENV production
# ENV NEXT_PUBLIC_API_URL "your_api_url"

# Expose the port Next.js listens on (usually 3000)
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["npm", "start"]