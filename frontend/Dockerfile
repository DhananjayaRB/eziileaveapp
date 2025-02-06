FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
COPY . .
# Ensure Next.js binary has execution permission
RUN chmod +x node_modules/.bin/next

# Set correct file permissions for non-root execution
RUN chmod -R 755 /app

# Set a non-root user for better security
USER node

# Expose the port Next.js runs on
EXPOSE 3000

# Use npx to run Next.js to avoid permission issues
CMD ["npx", "next", "dev"]