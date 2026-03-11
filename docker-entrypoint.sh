#!/bin/sh
set -e

# Ensure persistent data directory exists
mkdir -p /data

# Always run migrations (idempotent – only applies new ones)
echo "🔄 Running migrations..."
cd /app/packages/backend
npx prisma migrate deploy
echo "✅ Migrations done"

# Always seed (upsert = safe, updates subject colors etc.)
echo "🌿 Seeding database..."
npx prisma db seed
cd /app

echo "🚀 Starting MediLearn on port $PORT..."
exec node /app/packages/backend/dist/index.js
