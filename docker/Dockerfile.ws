FROM node:22-alpine

RUN corepack enable

WORKDIR /usr/src/app

COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY package.json ./
COPY turbo.json ./

COPY ./packages ./packages
COPY ./apps/ws-backend ./apps/ws-backend

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @repo/db build

RUN pnpm run db:generate

EXPOSE 8080

CMD ["pnpm", "run", "start:websocket"]