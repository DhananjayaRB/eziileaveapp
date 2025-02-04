FROM node:18-alpine

WORKDIR /app

COPY package.json ./
# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Remove development dependencies to reduce image size
RUN npm prune --production

# Use a smaller base image for the final container
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only the built application from the builder stage
COPY --from=builder /app/package.json .  
COPY --from=builder /app/node_modules ./node_modules  
COPY --from=builder /app/.next .next  
COPY --from=builder /app/public ./public  

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]