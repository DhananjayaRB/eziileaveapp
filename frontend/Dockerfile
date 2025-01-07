FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

ENV NODE_ENV=development

EXPOSE 3000

CMD ["npm", "run", "dev"]