# Use the official Node.js image as the base
FROM node:18-alpine AS builder

# Set the working directory
WORKDIR frontend/app

# Copy package.json and install dependencies
COPY frontend/package*.json ./
RUN npm install --omit=dev

# Copy the entire frontend source code
COPY frontend/src ./src
COPY frontend/public ./public
COPY frontend/next.config.js .
COPY frontend/tsconfig.json .

# Build the Next.js application
RUN npm run build

# Serve the app using a smaller production image
FROM node:18-alpine
WORKDIR frontend/app

# Copy only necessary files from the builder stage
COPY --from=builder /app ./

# Expose the Next.js default port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]