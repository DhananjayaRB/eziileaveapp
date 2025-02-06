FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN chmod +x node_modules/.bin/next
RUN npm install --omit=dev
COPY . .

EXPOSE 3000

CMD ["npx", "next", "dev"]