#!/bin/sh

# Exit immediately if a command exits with a non-zero status.
set -e

# Function to wait for the database
wait_for_db() {
  echo "Waiting for database..."
  while ! nc -z postgres 5432; do
    sleep 1
  done
  echo "Database is available."
}

# Run migrations
run_migrations() {
  echo "Running Knex migrations..."
  npx knex migrate:latest --knexfile ./dist/knex/knexfile.js
  echo "Knex migrations finished."
}

# Run seeding
run_seeding() {
  echo "Running seeding..."
  node ./dist/knex/seed.js
  echo "Seeding finished."
}

# Wait for the database to be ready
wait_for_db

# Run database migrations
run_migrations

# Run database seeding
run_seeding

# Execute the main command passed to the script (e.g., npm run dev)
echo "Starting application..."
echo "Executing command: $@"
exec "$@"