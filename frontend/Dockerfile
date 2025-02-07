# Use Node.js LTS version
FROM node:18-bullseye

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install next
RUN npm install --production
RUN npm run build --force
# Copy the rest of the app
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Start Next.js in production mode
CMD ["npm", "start"]
