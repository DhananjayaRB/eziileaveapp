# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the application on port 4000
EXPOSE 4000

# Start the application
CMD ["npm", "start"]