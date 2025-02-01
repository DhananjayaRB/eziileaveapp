FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./

RUN ls -la && cat package.json  # Debug step
RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV=qa

EXPOSE 3000

CMD ["npm", "run", "dev"]