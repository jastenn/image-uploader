# docker pull 
FROM node:17.7.1-alpine3.15

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]