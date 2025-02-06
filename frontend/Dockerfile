# Use the official Node.js image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# 🔥 Fix permissions
RUN chown -R node:node /app && chmod -R 755 /app

# Switch to a non-root user
USER node

# Expose the port the app runs on
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "start"]