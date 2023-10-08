FROM node:16-alpine

WORKDIR /gomoku-backend

ADD ./package.json ./
ADD ./yarn.lock ./
ADD ./tsconfig.json ./
ADD ./.env ./
RUN yarn

CMD yarn bootstrapdb; yarn dev