# Use Node.js 18 as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./package.json and package-lock.json

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the application port (e.g., 3000)
EXPOSE 4000

# Start the application
CMD ["npm", "start"]