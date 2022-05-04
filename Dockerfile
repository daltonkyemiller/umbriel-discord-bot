FROM node:alpine as builder

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install


COPY . .

EXPOSE 8080
CMD [ "yarn", "run", "start" ]