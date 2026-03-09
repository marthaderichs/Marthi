#!/bin/sh
set -e

# Ensure persistent data directory exists
mkdir -p /data

# Parse the DB path from the DATABASE_URL (strips "file:" prefix)
DB_PATH="${DATABASE_URL#file:}"

# On first start: run migrations
if [ ! -f "$DB_PATH" ]; then
  echo "🌱 New database – running migrations..."
  cd /app/packages/backend
  npx prisma migrate deploy
  echo "✅ Migrations done"
  cd /app
fi

# Always seed (upsert = safe, updates subject colors etc.)
echo "🌿 Seeding database..."
cd /app/packages/backend
npx prisma db seed
cd /app

echo "🚀 Starting MediLearn on port $PORT..."
exec node /app/packages/backend/dist/index.js
