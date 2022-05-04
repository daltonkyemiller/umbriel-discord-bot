FROM node:alpine as builder

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

ENV NODE_ENV=production

ARG DISCORD_PROD_TOKEN
ENV DISCORD_PROD_TOKEN=$DISCORD_PROD_TOKEN

ARG DISCORD_PROD_CLIENT
ENV DISCORD_PROD_CLIENT=$DISCORD_PROD_CLIENT

RUN yarn install

COPY . .

EXPOSE 8080
CMD [ "node", "app.js" ]