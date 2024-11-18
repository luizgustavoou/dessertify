# Development image
# FROM node:alpine AS development
FROM node:20.11.1-bullseye-slim as development

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y procps

COPY package.json ./
COPY pnpm-lock.yaml ./
COPY tsconfig.json tsconfig.json
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install

COPY apps/auth apps/auth
COPY libs libs

RUN cd apps/auth && pnpm i
# RUN cd apps/auth && npx prisma migrate dev

# RUN pnpm run build

# Production image
# FROM node:alpine AS production
FROM node:20.11.1-bullseye-slim as production


ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY nest-cli.json nest-cli.json

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prod

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/auth/main"]

