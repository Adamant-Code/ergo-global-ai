# Base stage
FROM node:22.11.0-alpine AS base
RUN apk update && apk upgrade && apk add --no-cache libc6-compat netcat-openbsd python3 make g++

# Dependencies stage
FROM base AS deps
WORKDIR /app

COPY package.json turbo.json package-lock.json ./
COPY packages ./packages
COPY apps ./apps

RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

WORKDIR /app/packages/requestResponse
RUN npm run build

WORKDIR /app/apps/server
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/apps/server/package.json ./apps/server/package.json
COPY --from=builder /app/packages/requestResponse/package.json /app/packages/requestResponse/package.json

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/packages/requestResponse/dist /app/packages/requestResponse/dist
COPY --from=builder /app/apps/server/docker-entrypoint.sh ./apps/server/docker-entrypoint.sh

WORKDIR /app/apps/server

RUN npm ci --omit=dev
RUN chmod +x ./docker-entrypoint.sh
RUN chown -R appuser:nodejs /app

ENV NODE_ENV=production
ENV ADMIN_JS_SKIP_BUNDLE=true

EXPOSE 4000
USER appuser

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/src/index.js"]