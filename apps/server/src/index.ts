// Docs
import redoc from "redoc-express";

// External dependencies
import "dotenv/config";
import path from "path";
import cors from "cors";
import * as url from "url";
import morgan from "morgan";
import debugLib from "debug";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cookieParser from "cookie-parser";

// Route
import appRouter from "@/routes/index.js";
import stripeRouter from "@/routes/stripe/index.js";
import { setupChatNamespaceListeners } from "@/routes/chat/index.js";

// Config
import db from "@/config/objection.js";
import redisClient from "@/config/redis.js";
import { openapiSpec } from "@/docs/openapi.js";
import { serviceUrls } from "@/config/services.js";
import { setupSocketIOEngineListeners } from "@/config/socket.js";
import { socketIOConnectionManager } from "./routes/chat/services/connectionManager.js";

// Middleware
import { notFound } from "@/middleware/notFound.js";
import { errorHandler } from "@/middleware/errorHandler.js";

const app = express();
const debug = debugLib("server/index");
const PORT = Number(process.env.PORT) || 4000;
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const server = createServer(app);

const io = new Server(server, {
  path: "/socket.io/",
  cors: {
    credentials: true,
    methods: ["GET", "POST"],
    origin: serviceUrls.frontend,
  },
});

// Middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: serviceUrls.frontend,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/stripe", stripeRouter);
app.use(
  "/admin/frontend/assets",
  express.static(path.join(__dirname, "../public"))
);
app.use(express.json());

// Initialize Socket.IO on /chat namespace
setupChatNamespaceListeners(io.of("/chat"));
setupSocketIOEngineListeners(io);

// Start connection manager services
socketIOConnectionManager.startPingService(30);
socketIOConnectionManager.startCleanupServices(300, 900);

app.use("/", appRouter);

// Redoc setup
app.get(
  "/docs",
  redoc.default({
    title: "Server API Docs",
    specUrl: "/openapi.json",
  })
);
app.get("/openapi.json", (req, res) => {
  res.json(openapiSpec);
});

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Start the server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  debug(`Server running on http://localhost:${PORT}`);

  redisClient.on("connect", () => {
    debug("✅ Connected to Redis server");
    console.log("✅ Connected to Redis server");
  });
});

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

async function shutdown() {
  console.log("Gracefully shutting down...");

  try {
    await db.destroy();
    io.close();
    console.log("Database and Socket.IO connections closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}
