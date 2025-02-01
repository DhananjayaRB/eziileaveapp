FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./

COPY . .

EXPOSE 3000