FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]