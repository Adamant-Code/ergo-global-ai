#!/bin/bash

# Wait for Redis to be ready (for caching if needed)
# Only check if REDIS_URL is set (making it optional for production)
if [ -n "${REDIS_URL:-}" ]; then
  echo "REDIS_URL is set, checking Redis connectivity..."

  # Extract host and port from REDIS_URL
  # Format: redis://hostname:port or redis://hostname (defaults to 6379)
  REDIS_HOST=$(echo "$REDIS_URL" | sed -e 's|redis://||' -e 's|:[0-9]*||' -e 's|/.*||')
  REDIS_PORT=$(echo "$REDIS_URL" | grep -o ':[0-9]*' | tr -d ':')
  REDIS_PORT=${REDIS_PORT:-6379}

  echo "Checking Redis at $REDIS_HOST:$REDIS_PORT..."

  # Try to connect, but don't block indefinitely
  RETRY_COUNT=0
  MAX_RETRIES=30
  while ! nc -z "$REDIS_HOST" "$REDIS_PORT"; do
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
      echo "Warning: Could not connect to Redis after $MAX_RETRIES attempts. Proceeding anyway..."
      break
    fi
    sleep 1
  done

  if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
    echo "Redis connection successful"
  fi
else
  echo "REDIS_URL not set, skipping Redis check (caching disabled)"
fi

# Execute the command
exec "$@"
