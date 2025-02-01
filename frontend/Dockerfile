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

# Copy only the necessary files from the builder stage
COPY --from=builder /frontend/package*.json ./
COPY --from=builder /frontend/.next .next
COPY --from=builder /frontend/node_modules node_modules
COPY --from=builder /frontend/public public

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
