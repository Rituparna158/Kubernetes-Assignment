FROM node:20-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm

COPY . .

RUN pnpm install

WORKDIR /app/apps/stats-service

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm


COPY --from=builder /app/apps/stats-service/package.json ./

RUN pnpm install --production

COPY --from=builder /app/apps/stats-service/dist ./dist

ENV NODE_ENV=production

EXPOSE 3002
CMD ["node", "dist/server.js"]