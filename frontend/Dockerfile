# Use Node.js LTS version
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# Copy the rest of the app
COPY . .

# 🔥 Fix permissions
RUN chown -R node:node /app && chmod -R 755 /app


# Expose the Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "run", "dev"]
