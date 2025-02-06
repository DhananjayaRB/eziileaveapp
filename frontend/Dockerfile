FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev
RUN chmod +x node_modules/.bin/next
COPY . .

EXPOSE 3000

CMD ["npx", "next", "dev"]