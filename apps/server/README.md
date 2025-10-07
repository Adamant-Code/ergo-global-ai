# Monorepo Server Template

An Express.js API template with TypeScript, designed for modularity, security, and extensibility, now configured for local development using Docker Compose within a monorepo environment.

## Overview

This project is a backend API server within a monorepo, housed under `apps/server/`. It uses Express.js, TypeScript, and Zod for validation, with a focus on clean architecture and centralized documentation. The structure mirrors business actions (e.g., `auth/login/`, `user/register/`) for clarity and maintainability.

For local development, this service is designed to be run as a Docker container orchestrated by Docker Compose, connecting to containerized PostgreSQL and Redis instances.

## Prerequisites

To run this server using Docker Compose, you need the following installed and available on your local machine:

- **Git**: For cloning the repository.
- **Docker Engine**: The Docker daemon must be running.
- **Docker Compose**: V2 or later is required (often included with Docker Desktop installations).

Having Node.js and npm/yarn/pnpm installed locally is beneficial for running linting, testing, or specific build tasks outside the Docker Compose stack, but the core server development environment runs within Docker.

## Running the Server with Docker Compose

The server is designed to run as part of the larger monorepo stack using Docker Compose.

### 1. Clone the monorepo repository

```bash
git clone git@github.com:Adamant-Code/monorepo-template.git
cd monorepo-template
```

### 2. Set up environment variables

Create a `.env` file at the root of the monorepo directory (`monorepo-template/.env`). This file will contain variables shared across Docker Compose services, such as database credentials.

For the root `.env`:

```env
# Database Credentials (Used by Docker Compose for Postgres service)
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword
POSTGRES_DB=app_db

# Define your JWT secret here or in apps/server/.env
# JWT_SECRET=your-very-long-secret-key-here
```

Create or update the `apps/server/.env` file. This file contains environment variables specific to the server application itself, including internal service URLs that use Docker Compose service names.

For `apps/server/.env`:

```env
# apps/server/.env
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
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# User Vars
USER_PASSWORD=P@ssword123
USER_EMAIL=test_account3@example.com

# Admin Vars
SUPER_ADMIN_PASSWORD=P@ssword123
SUPER_ADMIN_EMAIL=test_account3@example.com

# Session Vars
SESSION_SECRET=your_very_long_and_random_session_secret
ADMINJS_COOKIE_PASSWORD=another_very_long_and_random_cookie_password
# Note: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB will be injected from the root .env by Docker Compose
```

### 3. Build and start the server service and its dependencies

From the root of the monorepo directory, run the following command:

```bash
# Build and start specific services in detached mode (production, e.g., server, postgres, redis)
docker-compose -f docker-compose.yml up --build -d server postgres redis

# Build and start specific services in detached mode (development, e.g., server, postgres, redis)
docker-compose -f docker-compose.dev.yml up --build -d server postgres redis
```

This command will:

- Build the Docker image for the server service (if needed).
- Create and start the postgres and redis containers.
- Create necessary named volumes (`postgres_data`, `redis_data`) for data and dependency persistence.
- Wait for postgres and redis to become healthy.
- Run the docker-entrypoint.sh script in the server container, which waits for the DB, runs migrations, and seeds the database.
- Start the server application process (`npm run dev`) inside the server container.

The server will be accessible on your host machine at <http://localhost:4000>. Hot-reloading for code changes in `apps/server` and `packages/requestResponse` is enabled via volume mounts.

## Stopping the Server

To stop the server and its dependent services (Postgres, Redis):

```bash
# Stop and remove specific services (production, e.g., server, postgres, redis)
docker-compose -f docker-compose.yml rm -f server postgres redis

# Stop and remove specific services (development, e.g., server, postgres, redis)
docker-compose -f docker-compose.dev.yml rm -f server postgres redis
```

To stop and remove all services defined in docker-compose.yml, including networks and default volumes:

```bash
# Stop and remove all services, networks, and containers (production)
docker-compose -f docker-compose.yml down

# Stop and remove all services, networks, and containers (development)
docker-compose -f docker-compose.dev.yml down
```

To stop and remove all services, networks, and named volumes (which will reset your database data and installed dependencies):

```bash
# Stop and remove all services, networks, containers, and named volumes (production)
docker-compose -f docker-compose.yml down --volumes

# Stop and remove all services, networks, containers, and named volumes (development)
docker-compose -f docker-compose.dev.yml down --volumes
```

## Database Operations

Database migrations and initial seeding are automatically handled when the server container starts for the first time (or after volumes are removed) by the `docker-entrypoint.sh` script.

## Project Structure

The project is organized under `apps/server/src/` to separate concerns and mirror business logic. Key folders:

```bash
apps/server/src/
.
├── Dockerfile
├── Dockerfile.dev
├── README.md
├── bundleComponents.ts
├── docker-entrypoint.sh
├── knex
│   ├── knexfile.ts
│   ├── migrations
│   │   ├── 20250514010614_initial_setup.ts
│   │   └── 20250514020759_update_user_id_to_admin_id.ts
│   └── seed.ts
├── package-lock.json
├── package.json
├── public
│   ├── images
│   │   └── logo.png
│   └── styles
│       ├── login.css
│       └── table.css
├── src
│   ├── config
│   │   ├── objection.ts
│   │   ├── redis.ts
│   │   ├── services.ts
│   │   └── vector
│   ├── constants
│   │   ├── adminUsers.ts
│   │   ├── index.ts
│   │   └── user.ts
│   ├── docs
│   │   ├── components.yml
│   │   ├── openapi.ts
│   │   └── routes
│   ├── errors
│   │   ├── AuthError.ts
│   │   ├── CustomError.ts
│   │   ├── DatabaseError.ts
│   │   ├── NotFoundError.ts
│   │   ├── ValidationError.ts
│   │   └── index.ts
│   ├── index.ts
│   ├── middleware
│   │   ├── errorHandler.ts
│   │   ├── notFound.ts
│   │   ├── validateRequest.ts
│   │   └── verifyJWT.ts
│   ├── models
│   │   ├── AdminUser.ts
│   │   ├── BaseModel.ts
│   │   ├── Log.ts
│   │   ├── Session.ts
│   │   └── User.ts
│   ├── routes
│   │   ├── admin
│   │   ├── auth
│   │   ├── health
│   │   ├── index.ts
│   │   └── user
│   ├── types
│   │   └── auth
│   └── utils
│       └── routes
└── tsconfig.json
```

## Structure Details

- **config/**: Manages external service connections (database, Redis, other APIs).
  - **services.ts**: General service configurations.
  - **backendService.ts**: Lists backend endpoints (e.g., AI service).
  - **redis.ts**: Redis client instance.
- **docs/**: Centralized Swagger docs, mirroring `routes/` structure.
- **routes/**: Organizes endpoints by business action (e.g., `auth/login/`).
  - Each action folder contains:
    - **index.ts**: Route handler (wires middleware, calls logic).
    - **[action].ts**: Business logic (e.g., `login.ts`).
    - **schemas/**: Zod validation schemas if applicable.
- **utils/** and **types/**: Organized by business logic (e.g., `utils/routes/auth/`).

## API Documentation

Swagger documentation is centralized in `src/docs/` and served via Redoc.

### Accessing Documentation

Once the server is running via Docker Compose, the documentation is available at:

- **Interactive Docs**: <http://localhost:4000/docs>
  - Searchable, with request/response examples and authentication details.
- **Raw OpenAPI Spec**: <http://localhost:4000/openapi.json>
  - Importable into API testing tools.

### Updating Documentation

- Edit YAML files in `src/docs/routes/` (e.g., `auth/login.yml`).
- Update `src/docs/components.yml` for shared metadata/tags.
- The documentation is automatically regenerated when the server restarts due to code changes (hot-reloading).

## Authentication

Uses JWT for protected routes.

### Headers

```bash
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### User Endpoints

#### POST /user/register

Register a new user.

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response (201):

```json
{
    "accessToken": "string"
}
```

### Auth Endpoints

#### POST /auth/login

Authenticate user.

```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

Response (200):

```json
{
    "accessToken": "string"
}
```

Sets HTTP-only refresh token cookie.

#### POST /auth/logout

Invalidate tokens (requires auth).

Headers:

```bash
Authorization: Bearer <access_token>
```

Response: 204 No Content

Clears refresh token cookie.

#### POST /auth/forgot-password

Request password reset.

```json
{
    "email": "user@example.com"
}
```

Response (200):

```json
{
    "message": "If an account exists with that email, a password reset link has been sent"
}
```

#### POST /auth/reset-password

Reset password.

```json
{
    "token": "reset_token_received",
    "password": "new_password123"
}
```

Response (200):

```json
{
    "message": "Password successfully reset"
}
```

#### POST /auth/refresh-token

Refresh access token (uses cookie).

Response (200):

```json
{
    "accessToken": "string"
}
```

#### POST /auth/revoke-token

Revoke refresh token (requires auth).

Headers:

```bash
Authorization: Bearer <access_token>
```

```json
{
    "refreshToken": "token_to_revoke"
}
```

Response: 204 No Content

### Health Endpoint

#### GET /health

Check API health.

Query Parameters:

- format (optional): short or full

Response (200):

```json
{
    "status": "ok",
    "timestamp": "2025-04-11T12:00:00Z",
    "uptime": 1234,
    "aiService": { "status": "ok" }
}
```

## Common Status Codes

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Rate Limiting

Not currently implemented.

## Route Creation Guide

This section describes how to add new API endpoints, which is the same whether running locally or in Docker.

1. Create a route folder in `src/routes/` (e.g., `user/create/`):

    ```typescript
    // src/routes/user/create/index.ts
    import { Router } from "express";
    import { validateRequest } from "../../../middleware/validateRequest";
    import { create } from "./create";
    import { createSchema } from "./schemas";

    const router = Router();
    // Apply validation middleware before the route handler
    router.post("/", validateRequest(createSchema), create);
    export default router;
    ```

2. Add business logic:

    ```typescript
    // src/routes/user/create/create.ts
    import { Request, Response } from "express";
    import asyncHandler from "express-async-handler";
    import { CreateSchemaType } from "./schemas";

    // Use the validated request body type
    export const create = asyncHandler(
        async (req: Request<{}, {}, CreateSchemaType>, res: Response) => {
            // Access validated data via req.body
            const { field } = req.body;
            console.log(`Received field: ${field}`);
            // Implement your business logic here (e.g., interact with DB)

            res.status(201).json({ message: "Resource created successfully" });
        }
    );
    ```

3. Add schema:

    ```typescript
    // src/routes/user/create/schemas/index.ts
    import { z } from "zod";

    export const createSchema = z.object({
        field: z.string().min(1, "Field is required"),
        // Add other fields as needed
    });
    export type CreateSchemaType = z.infer<typeof createSchema>;
    ```

4. Register the new route in `src/routes/index.ts`:

    ```typescript
    // src/routes/index.ts
    import { Router } from "express";
    import authRouter from "./auth";
    import healthRouter from "./health";
    import userRouter from "./user";

    // Import the new route router
    import createUserRouter from "./user/create";

    const router = Router();

    // Register the main route modules
    router.use("/auth", authRouter);
    router.use("/user", userRouter);
    router.use("/health", healthRouter);
    router.use("/user/create", createUserRouter);

    export default router;
    ```

5. (Optional) Add API documentation for the new route in `src/docs/routes/user/create.yml` mirroring the structure.

## AdminJS Dashboard Setup and Configuration

The backend server (`apps/server`) includes an **AdminJS** dashboard, accessible at `/admin` (e.g., [http://localhost:4000/admin](http://localhost:4000/admin)). This dashboard provides a UI for managing application resources with full CRUD operations and supports custom React components for advanced admin workflows.

### Features

- **Resource Management:** CRUD operations for registered resources (e.g., Users, Posts)
- **Custom Components:** Extend AdminJS with custom React components for dashboards, actions, or resource views
- **Authentication:** Secured with admin credentials and cookie-based authentication
- **Role-based Access Control:** Restrict access to resources/actions based on admin roles

### Accessing the Admin Dashboard

Once the server is running, the AdminJS dashboard is available at:

```bash
http://localhost:4000/admin
```

### AdminJS Authentication

AdminJS is protected by cookie-based authentication. The authentication is configured in `admin.ts`, and the cookie is encrypted using the `ADMINJS_COOKIE_PASSWORD` environment variable.

### Environment Variables

Add the following to your `.env` file:

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
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=public"

# User Vars
USER_PASSWORD=P@ssword123
USER_EMAIL=test_account3@example.com

# Admin Vars
SUPER_ADMIN_PASSWORD=P@ssword123
SUPER_ADMIN_EMAIL=test_account3@example.com

# Session Vars
SESSION_SECRET=your_very_long_and_random_session_secret
ADMINJS_COOKIE_PASSWORD=another_very_long_and_random_cookie_password
```

### Adding a New Resource

Resources are registered in `src/routes/admin/config/resources/`. Each resource file exports an AdminJS resource configuration.

#### Steps

1. **Create a resource configuration file** in `src/routes/admin/config/resources/`

   For example, `src/routes/admin/config/resources/post.ts`:

   ```typescript
   // src/routes/admin/config/resources/post.ts
   import { CurrentAdmin } from "adminjs";
   import { AdminUser } from "@/models/AdminUser.js";
   import { Components } from "../componentLoader.js";
   import { AdminJSRequest } from "../../client/types/dashboard/index.js";

   const postResource = {
     resource: AdminUser,
     options: {
       editProperties: ["title", "content"],
       navigation: { icon: "Folder", name: "Post" },
       sort: { direction: "asc", sortBy: "createdAt" },
       filterProperties: [
         "title",
         "createdAt",
         "updatedAt",
       ],
       showProperties: [
         "id",
         "title",
         "content",
         "createdAt",
         "updatedAt",
       ],
       listProperties: [
         "id",
         "title",
         "content",
         "createdAt",
         "updatedAt",
       ],

       actions: {
         list: {
           before: async (request: AdminJSRequest) => {
             request.query.perPage = 5;
             return request;
           },
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) =>
             currentAdmin?.role === "SUPER_ADMIN" ||
             currentAdmin?.role === "EDITOR" ||
             currentAdmin?.role === "VIEWER",
         },
         show: {
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) =>
             currentAdmin?.role === "SUPER_ADMIN" ||
             currentAdmin?.role === "EDITOR" ||
             currentAdmin?.role === "VIEWER",
         },
         edit: {
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) =>
             currentAdmin?.role === "SUPER_ADMIN" ||
             currentAdmin?.role === "EDITOR",
         },
         new: {
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) =>
             currentAdmin?.role === "SUPER_ADMIN" ||
             currentAdmin?.role === "EDITOR",
         },
         delete: {
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) =>
             currentAdmin?.role === "SUPER_ADMIN" ||
             currentAdmin?.role === "EDITOR",
         },
         bulkDelete: {
           isAccessible: ({
             currentAdmin,
           }: {
             currentAdmin: CurrentAdmin;
           }) => currentAdmin?.role === "SUPER_ADMIN",
         },
       },

       properties: {
         id: {
           components: {
             list: Components.ListIdProperty,
             show: Components.ShowIdProperty,
           },
         },
         createdAt: {
           components: {
             list: Components.ListDateProperty,
             show: Components.ShowDateProperty,
           },
         },
         updatedAt: {
           components: {
             list: Components.ListDateProperty,
             show: Components.ShowDateProperty,
           },
         },
       },
     },
   };

   export default postResource;
   ```

2. **Import and register the resource** in your admin setup file (`src/routes/admin/admin.ts`):

   ```typescript
   // src/routes/admin/admin.ts
   import postResource from "./config/resources/post.js";

   export const admin: AdminJS = new AdminJS({
     // ...other configuration
     resources: [adminResource, userResource, postResource],
   });
   ```

3. **Restart the Server:**

   ```bash
   docker-compose restart server
   ```

   The new resource will appear in the AdminJS sidebar.

### Creating and Registering Custom Components

AdminJS supports custom React components that can be used in dashboards, list views, edit views, and show views.

1. **Create a custom component**:

   Create a new component in `src/routes/admin/client/components/`. For example, a custom dashboard component:

   ```tsx
   // src/routes/admin/client/components/Dashboard/Dashboard.tsx
   import React from 'react'
   import { Box, H2 } from '@adminjs/design-system'

   const Dashboard = () => (
     <Box>
       <H2>Welcome to the Custom Admin Dashboard!</H2>
       {/* Add custom widgets, stats, etc. */}
     </Box>
   )

   export default Dashboard
   ```

   Or a custom property component:

   ```tsx
   // src/routes/admin/client/components/ListProperty/ListTitleProperty.tsx
   import React from 'react'
   import { Text } from '@adminjs/design-system'

   const ListTitleProperty = (props) => {
     const { record } = props
     return (
       <Text fontWeight="bold">{record.params.title}</Text>
     )
   }

   export default ListTitleProperty
   ```

2. **Register the component** in the component loader (`src/routes/admin/config/componentLoader.ts`):

   ```typescript
   // src/routes/admin/config/componentLoader.ts
   export const Components = {
     Dashboard: componentLoader.add(
       "Dashboard",
       "../client/components/Dashboard/Dashboard"
     ),

     // Edit Views
     EditDisabledProperty: componentLoader.add(
       "EditDisabledProperty",
       "../client/components/EditProperty/EditDisabledProperty"
     ),

     // List Views
     ListIdProperty: componentLoader.add(
       "ListIdProperty",
       "../client/components/ListProperty/ListIdProperty"
     ),
     ListDateProperty: componentLoader.add(
       "ListDateProperty",
       "../client/components/ListProperty/ListDateProperty"
     ),
     ListTitleProperty: componentLoader.add(
       "ListTitleProperty",
       "../client/components/ListProperty/ListTitleProperty"
     ),
     // ...other components
   };
   ```

3. **Use the component** in a resource configuration:

   ```typescript
   // src/routes/admin/config/resources/post.ts
   properties: {
     id: {
       components: {
         list: Components.ListIdProperty,
         show: Components.ShowIdProperty,
       },
     },
     title: {
       components: {
         list: Components.ListTitleProperty,
         show: Components.ShowTitleProperty,
       },
     },
     createdAt: {
       components: {
         list: Components.ListDateProperty,
         show: Components.ShowDateProperty,
       },
     },
     // ...other properties
   },
   ```

4. **Update the AdminJS entry point** (`apps/server/.adminjs/entry.js`):

   This file is typically generated automatically, but you might need to update it if you're adding new components:

   ```javascript
   // filepath: /apps/server/.adminjs/entry.js
   AdminJS.UserComponents = {}
   AdminJS.env.NODE_ENV = "development"
   import Dashboard from '../src/routes/admin/client/components/Dashboard/Dashboard'
   AdminJS.UserComponents.Dashboard = Dashboard
   import EditDisabledProperty from '../src/routes/admin/client/components/EditProperty/EditDisabledProperty'
   AdminJS.UserComponents.EditDisabledProperty = EditDisabledProperty
   import ListIdProperty from '../src/routes/admin/client/components/ListProperty/ListIdProperty'
   AdminJS.UserComponents.ListIdProperty = ListIdProperty
   import ListDateProperty from '../src/routes/admin/client/components/ListProperty/ListDateProperty'
   AdminJS.UserComponents.ListDateProperty = ListDateProperty
   import ListTitleProperty from '../src/routes/admin/client/components/ListProperty/ListTitleProperty'
   AdminJS.UserComponents.ListTitleProperty = ListTitleProperty
   // ...other component imports
   ```

## Setting Up a Dashboard Component

To use a custom component as the main dashboard:

1. Register the component in the component loader as shown above.
2. Set it as the dashboard component in the AdminJS configuration:

   ```typescript
   // src/routes/admin/admin.ts
   import { Components } from "./config/componentLoader.js";

   export const admin: AdminJS = new AdminJS({
     // ...other configuration
     dashboard: {
       component: Components.Dashboard,
     },
     // ...other options
   });
   ```

## Available Resources

The following resources are currently available in the AdminJS dashboard:

- **AdminUser**: Manages admin users with different roles
- **User**: Manages regular application users
- *(Additional resources will appear here as they are added)*

## File Structure Reference

```bash
apps/server/
└── src/
    └── routes/
        └── admin/
            ├── admin.ts                # Main AdminJS setup
            ├── client/
            │   ├── components/         # Custom React components
            │   │   ├── Dashboard/
            │   │   │   └── Dashboard.tsx
            │   │   ├── EditProperty/
            │   │   │   └── EditDisabledProperty.tsx
            │   │   ├── ListProperty/
            │   │   │   ├── ListIdProperty.tsx
            │   │   │   ├── ListDateProperty.tsx
            │   │   │   └── ListTitleProperty.tsx
            │   │   └── ShowProperty/
            │   │       ├── ShowIdProperty.tsx
            │   │       └── ShowDateProperty.tsx
            │   └── types/
            │       └── dashboard/
            │           └── index.js
            └── config/
                ├── componentLoader.ts   # Component registry
                └── resources/          # Resource definitions
                    ├── admin.ts
                    ├── user.ts
                    └── post.ts
```

## Role-Based Access Control

AdminJS supports role-based access control. The example above demonstrates how to restrict access to actions based on the admin's role:

- **SUPER_ADMIN**: Full access to all resources and actions
- **EDITOR**: Can view, create, edit, and delete resources
- **VIEWER**: Can only view resources

You can configure these permissions in each resource's actions configuration.

## Common Issues and Solutions (Specific to Server)

### Database Connection Errors

- Ensure the postgres service is healthy and running (`docker-compose ps`, `docker-compose logs postgres`).
- Verify the DATABASE_URL in `apps/server/.env` correctly uses the service name `postgres` (`postgresql://user:password@postgres:5432/dbname`).
- Check the server container logs for specific database error messages (`docker-compose logs server`).

### Redis Connection Errors

- Ensure the redis service is healthy and running (`docker-compose ps`, `docker-compose logs redis`).
- Verify the REDIS_URL in `apps/server/.env` correctly uses the service name `redis` (`redis://redis:6379`).

### Dependencies Not Found Inside Container

- Ensure `npm install` completes successfully in the server's Dockerfile.
- Verify the named volumes for node_modules (`server_node_modules`, `shared_node_modules`) are correctly configured in `docker-compose.yml` and haven't been corrupted (use `docker-compose down --volumes` to reset).
