FROM node:alpine

WORKDIR /app
COPY package*.json .
# Install dependencies before copying the full project
RUN npm install --force
RUN npm rebuild node-sass
COPY . .

CMD ["npm", "run", "dev"]
