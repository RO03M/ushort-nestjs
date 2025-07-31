FROM node:24.4.1-alpine AS build
WORKDIR /app

COPY yarn.lock ./
COPY package.json ./
COPY .env ./

RUN yarn ci

COPY . .
RUN yarn build

FROM node:24.4.1-alpine AS pruned_node_modules
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn ci --production

FROM node:24.4.1-alpine
WORKDIR /usr/src/app
COPY --from=pruned_node_modules /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/.env .env

EXPOSE 8000

CMD ["node", "dist/main"]
