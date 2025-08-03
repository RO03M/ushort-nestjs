FROM node:24.4.1-alpine AS build
WORKDIR /app

COPY yarn.lock ./
COPY package.json ./
RUN yarn ci

COPY . .
RUN yarn build

EXPOSE 3000

CMD ["node", "dist/main"]