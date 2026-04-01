FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

WORKDIR /app/apps/worker-service

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm


COPY --from=builder /app/apps/worker-service/package.json ./

RUN pnpm install --production

COPY --from=builder /app/apps/worker-service/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/server.js"]