FROM node:alpine

WORKDIR /app
RUN rm -rf build ||true 
RUN npm rebuild node-sass
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
