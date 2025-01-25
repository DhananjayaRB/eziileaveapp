FROM node:alpine

WORKDIR /app
COPY ./package.json .
RUN rm -rf build ||true 
RUN npm install --force
RUN npm rebuild node-sass
COPY . .

CMD ["npm", "run", "dev"]
