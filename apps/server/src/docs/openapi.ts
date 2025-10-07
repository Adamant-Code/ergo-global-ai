import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Server API",
      version: "1.0.0",
      description: "API for monorepo-template server",
    },
    servers: [{ url: "http://localhost:4000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "src/docs/*.yml",
    "src/docs/routes/user/*.yml",
    "src/docs/routes/auth/*.yml",
    "src/docs/routes/health/*.yml",
  ],
};

export const openapiSpec = swaggerJsdoc(options);
