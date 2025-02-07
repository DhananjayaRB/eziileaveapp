# Use Node.js LTS version (Debian-based for better compatibility)
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy the rest of the app files
COPY . .

# 🔥 Fix: Ensure correct file permissions for the entire app directory
RUN chown -R node:node /app && chmod -R 755 /app

# Switch to a non-root user for security
USER node

# Expose the Next.js port
EXPOSE 3000

# Run Next.js in development mode
CMD ["npm", "run", "start"]