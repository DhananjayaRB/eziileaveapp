FROM node:alpine

WORKDIR /app
COPY ./package.json .
RUN rm -rf build ||true 
RUN npm install --force
RUN npm rebuild node-sass
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
