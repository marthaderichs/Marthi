#!/bin/sh
set -e

# Ensure persistent data directory exists
mkdir -p /data

# Parse the DB path from the DATABASE_URL (strips "file:" prefix)
DB_PATH="${DATABASE_URL#file:}"

# On first start: run migrations and seed the database
if [ ! -f "$DB_PATH" ]; then
  echo "🌱 New database – running migrations and seed..."
  cd /app/packages/backend
  npx prisma migrate deploy
  npx prisma db seed
  echo "✅ Database ready"
  cd /app
fi

echo "🚀 Starting MediLearn on port $PORT..."
exec node /app/packages/backend/dist/index.js
