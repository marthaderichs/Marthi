# ─── Stage 1: Build ────────────────────────────────────────────────────────
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files for workspace dependency resolution
COPY package.json package-lock.json* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

RUN npm ci

# Build shared
COPY packages/shared/ ./packages/shared/
RUN cd packages/shared && npm run build

# Build frontend
COPY packages/frontend/ ./packages/frontend/
RUN cd packages/frontend && npm run build

# Build backend + generate Prisma client
COPY packages/backend/ ./packages/backend/
RUN cd packages/backend && npm run build && npx prisma generate


# ─── Stage 2: Production ────────────────────────────────────────────────────
FROM node:20-slim AS production
WORKDIR /app

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Package files needed for workspace resolution at runtime
COPY package.json ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/backend/package.json ./packages/backend/
COPY packages/frontend/package.json ./packages/frontend/

# node_modules (includes workspace links, Prisma client, tsx for seeding)
COPY --from=builder /app/node_modules ./node_modules

# Built artifacts
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/backend/dist ./packages/backend/dist
COPY --from=builder /app/packages/frontend/dist ./packages/frontend/dist

# Prisma schema + migrations + seed (needed for first-run init)
COPY --from=builder /app/packages/backend/prisma ./packages/backend/prisma

ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=file:/data/medilearn.db

EXPOSE 3000

VOLUME ["/data"]

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
