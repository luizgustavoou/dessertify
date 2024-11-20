# Development image
FROM node:20-bullseye as development

WORKDIR /usr/src/app

# RUN apt-get update && apt-get install -y procps

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

# RUN yarn build

# Production image
FROM node:20-bullseye as production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
