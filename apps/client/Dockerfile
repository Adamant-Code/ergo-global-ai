# syntax=docker.io/docker/dockerfile:1

# Base image
FROM node:22.11.0-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
COPY apps/client/package.json apps/client/
COPY packages/requestResponse/package.json packages/requestResponse/
RUN npm ci

# Build stage
FROM base AS builder
ENV NEXT_PRIVATE_STANDALONE=true
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
WORKDIR /app/apps/client
RUN npm run build

# Runtime stage
FROM node:22.11.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Set up user and group
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the standalone app (server.js and related files)
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone/apps/client/. ./
# Copy the node_modules from the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone/node_modules ./node_modules
# Copy static files
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./.next/static
# Copy public directory (if it exists)
# COPY --from=builder --chown=nextjs:nodejs /app/apps/client/public ./public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]