# Monorepo Template

A modern TypeScript monorepo using Docker Compose for containerization, featuring a Next.js frontend, Express backend, and Python AI service.

## Project Structure

```bash
monorepo-template/
.
├── README.md
├── ai-service
│   ├── __init__.py
│   ├── __pycache__
│   │   ├── main.cpython-310.pyc
│   │   └── main.cpython-312.pyc
│   ├── config
│   │   ├── __init__.py
│   │   ├── __pycache__
│   │   ├── logging_config.py
│   │   ├── model_config.py
│   │   └── settings.py
│   ├── examples
│   │   ├── basic_completion.py
│   │   ├── chain_prompts.py
│   │   └── chat_session.py
│   ├── main.py
│   ├── requirements.txt
│   └── src
│       ├── __init__.py
│       ├── __pycache__
│       ├── api
│       ├── handlers
│       ├── llm
│       ├── middleware
│       ├── prompt_engineering
│       └── utils
├── apps
│   ├── client
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── apps
│   │   ├── assets
│   │   ├── next-env.d.ts
│   │   ├── next.config.mjs
│   │   ├── package.json
│   │   ├── postcss.config.mjs
│   │   ├── public
│   │   ├── src
│   │   ├── tailwind.config.ts
│   │   └── tsconfig.json
│   └── server
│       ├── Dockerfile
│       ├── README.md
│       ├── apps
│       ├── docker-entrypoint.sh
│       ├── package-lock.json
│       ├── package.json
│       ├── knex
│       ├── src
│       └── tsconfig.json
├── docker-compose.yml
├── package-lock.json
├── package.json
├── packages
│   └── requestResponse
│       ├── README.md
│       ├── package.json
│       ├── src
│       └── tsconfig.json
└── turbo.json  # <-- Still present, but not the primary execution tool for the full stack
```

The monorepo is organized into three main sections, now managed as separate services within Docker containers:

### `apps/`: Contains the Node.js applications

- **server/**: Express.js backend API with TypeScript
- **client/**: NextJs frontend App with TypeScript

### `ai-service/`: Standalone Python AI service

- Configured as a separate Docker service.
- Independent dependency management within its container.
- Designed for independent deployment and scaling via containerization.

### `packages/`: Shared internal packages

- **requestResponse/**: Common TypeScript type definitions
- Shared with server and client containers via Docker volume mounts.

Each application and the AI service maintain their own:

- Dependencies (installed within their respective containers)
- Build configuration (defined in their Dockerfiles)
- Execution environment (isolated within containers)

## Prerequisites

To run this project using Docker Compose, you need the following installed on your local machine:

- **Git**: For cloning the repository.
- **Docker**: Including the Docker daemon and Docker CLI.
- **Docker Compose**: V2 or later is recommended (often bundled with Docker Desktop).
- **Node.js** (Optional but Recommended): While the core services run in Docker, having Node.js and npm/yarn/pnpm installed locally is useful for running individual workspace tasks (like linting, testing, or specific builds) outside of the full Docker Compose stack, or for managing root-level dependencies.

## Installation and Setup

### 1. Clone the repository

```bash
git clone git@github.com:Adamant-Code/monorepo-template.git
cd monorepo-template
```

### 2. Set up environment variables

Create `.env` files at the root of the monorepo directory. Docker Compose will automatically load variables from `.env` and make them available to your services.

For the root `.env` (used by Docker Compose and potentially server):

```env
PORT=4000
REFRESH_TOKEN_EXPIRY=7d
REDIS_URL=redis://redis:6379
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your-very-long-secret-key-here #Use a strong 32+ characters unique key in production

# PostgreSQL Configuration
POSTGRES_DB=app_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=securepassword123
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public"

# User Vars
USER_PASSWORD=P@ssword123
USER_EMAIL=devuser@example.com

# Admin Vars
SUPER_ADMIN_PASSWORD=P@ssword123
SUPER_ADMIN_EMAIL=devuser@example.com

# Session Vars
SESSION_SECRET=your_very_long_and_random_session_secret
ADMINJS_COOKIE_PASSWORD=another_very_long_and_random_cookie_password
```

Create `apps/server/.env` for server-specific variables not managed by Docker Compose:

```env
PORT=4000
REFRESH_TOKEN_EXPIRY=7d
REDIS_URL=redis://localhost:6379
BACKEND_URL=http://localhost:4000
FRONTEND_URL=http://localhost:3000
AI_SERVICE_URL=http://localhost:8000
JWT_SECRET=your-very-long-secret-key-here #Use a strong 32+ characters unique key in production

# PostgreSQL Configuration
POSTGRES_DB=app_db
POSTGRES_USER=admin
POSTGRES_PASSWORD=securepassword123
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# User Vars
USER_PASSWORD=P@ssword123
USER_EMAIL=devuser@example.com

# Admin Vars
SUPER_ADMIN_PASSWORD=P@ssword123
SUPER_ADMIN_EMAIL=devuser@example.com

# Session Vars
SESSION_SECRET=your_very_long_and_random_session_secret
ADMINJS_COOKIE_PASSWORD=another_very_long_and_random_cookie_password
```

For `apps/client/.env`

```env

# apps/client/.env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-secret-key
NEXT_PUBLIC_API_URL=http://localhost:4000
API_URL=http://server:4000
```

For `ai-service/.env`

```env
# ai-service/.env

# Configuration for the AI service
# Example:
# AI_SERVICE_PORT=8000
# MODEL_PATH=/app/models/my_model.pt
```

### 3. Build and start the services

```bash
# Production Build
docker-compose up --build

# Production Build
docker-compose -f docker-compose.yml --build

# Development Build
docker-compose -f docker-compose.dev.yml --build
```

The `--build` flag ensures that Docker images for the services are built (or rebuilt if changes are detected) before starting the containers. This command will:

- Build the Docker images for the server, client, and ai-service (based on their respective Dockerfiles).
- Create and start the postgres and redis containers.
- Create necessary named volumes for data and node_modules persistence.
- Wait for postgres and redis to become healthy.
- Run the docker-entrypoint.sh script in the server container, which waits for the DB, runs migrations, and seeds the database.
- Start the main application processes in the server, client, and ai-service containers.

## Available Docker Compose Commands

Use the docker-compose CLI from the root of the monorepo to manage the services:

### Development

```bash
# Build and start all services in detached mode (production)
docker-compose -f docker-compose.yml up --build -d

# Build and start all services in detached mode (development)
docker-compose -f docker-compose.dev.yml up --build -d

# Start specific services with build (e.g., server and client)
docker-compose -f docker-compose.yml up --build -d server client

# Start all services without rebuilding (production)
docker-compose -f docker-compose.yml up -d

# Start all services without rebuilding (development)
docker-compose -f docker-compose.dev.yml up -d

# View logs for a specific service (production)
docker-compose -f docker-compose.yml logs server

# Follow logs for all services (production)
docker-compose -f docker-compose.yml logs -f

# Follow logs for a specific service (development)
docker-compose -f docker-compose.dev.yml logs -f server

# Stop all running services (production)
docker-compose -f docker-compose.yml stop

# Stop all running services (development)
docker-compose -f docker-compose.dev.yml stop

# Stop and remove all services, networks, and containers (production)
docker-compose -f docker-compose.yml down

# Stop and remove all services, networks, and containers (development)
docker-compose -f docker-compose.dev.yml down

# Stop and remove everything, including named volumes (production)
docker-compose -f docker-compose.yml down --volumes

# Stop and remove everything, including named volumes (development)
docker-compose -f docker-compose.dev.yml down --volumes

# Access a shell in the server container (production)
docker-compose -f docker-compose.yml exec server /bin/sh

# Access a shell in the server container (development)
docker-compose -f docker-compose.dev.yml exec server /bin/sh

# Build images without starting services (production)
docker-compose -f docker-compose.yml build

# Build images without starting services (development)
docker-compose -f docker-compose.dev.yml build

# List running containers (production)
docker-compose -f docker-compose.yml ps

# List running containers (development)
docker-compose -f docker-compose.dev.yml ps

# Pull latest images for services (production)
docker-compose -f docker-compose.yml pull

# Pull latest images for services (development)
docker-compose -f docker-compose.dev.yml pull
```

### Building

```bash
# Build images for all services (production)
docker-compose -f docker-compose.yml build

# Build images for all services (development)
docker-compose -f docker-compose.dev.yml build

# Build image for a specific service (e.g., server, production)
docker-compose -f docker-compose.yml build server

# Build image for a specific service (e.g., server, development)
docker-compose -f docker-compose.dev.yml build server

# Force rebuild without using cache (production, e.g., server)
docker-compose -f docker-compose.yml build --no-cache server

# Force rebuild without using cache (development, e.g., server)
docker-compose -f docker-compose.dev.yml build --no-cache server
```

## Database Management

Database migrations and seeding are handled automatically by the server container's docker-entrypoint.sh script on startup.

## Applications

### Client Application (NextJS)

- The frontend application built with NextJS and TypeScript.
- Runs in the client Docker container.
- Accessible locally via <http://localhost:3000>.

### Server Application (Express)

- The backend API built with Express.js and TypeScript.
- Runs in the server Docker container.
- Accessible locally via <http://localhost:4000>.

### AI Service (Python)

- The standalone Python AI service.
- Runs in the ai-service Docker container.
- Accessible locally via <http://localhost:8000>.

## Common Issues and Solutions

### Port Conflicts

- Client: 3000
- Server: 4000
- AI Service: 8000
- Database: 5432
- Redis: 6379

If these ports are in use on your host machine, modify the ports mappings in the `docker-compose.yml` file (e.g., "4001:4000" to map container port 5000 to host port 4001).

### Database/Data Persistence Issues

- If database changes or seeded data are lost after `docker-compose down` and `up`, ensure you are not using the `--volumes` flag with `docker-compose down` unless you intend to reset the data.
- Verify that the named volumes (`postgres_data`, `redis_data`) are correctly defined and mounted in `docker-compose.yml`. Use `docker volume ls` to inspect Docker volumes.

### Service Startup Order/Dependencies

- The `depends_on` and `healthcheck` configurations in `docker-compose.yml` are used to manage startup order (e.g., server waits for postgres and redis). If services fail to start due to dependencies, check healthcheck configurations and logs.

### Code Changes Not Reflecting (Hot-Reloading)

- Ensure the host volume mounts (`./apps/server:/app/apps/server`, etc.) are correctly configured in `docker-compose.yml`. These mounts are essential for hot-reloading to work.

For application-specific details, refer to each application's README (if available):

- API Documentation: Available at [http://localhost:4000/docs](http://localhost:4000/docs)
- OpenAPI/Swagger specification: [http://localhost:4000/openapi.json](http://localhost:4000/openapi.json)
- Interactive API documentation powered by Redoc
- Server Documentation: See [Server README](apps/server/README.md)
