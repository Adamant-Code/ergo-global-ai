#!/bin/bash

# Wait for Redis to be ready (for caching if needed)
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "Redis started"

# Execute the command
exec "$@"
