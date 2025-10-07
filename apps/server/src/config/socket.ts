import debugLib from "debug";
import { Server } from "socket.io";

const socketDebug = debugLib("server/src:config:socket");

export const setupSocketIOEngineListeners = (io: Server) => {
  io.engine.on("connection_error", (err) => {
    socketDebug(
      `Engine.IO connection error: ${err.req}, ${err.code}, ${err.message}, ${err.context}`
    );
  });

  io.engine.on("initial_headers", (_headers, req) => {
    socketDebug(
      `Engine.IO initial headers from ${req.socket.remoteAddress}`
    );
  });
};
