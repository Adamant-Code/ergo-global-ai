import {
  ClientInfo,
  PingMessage,
  ServerStats,
  ConnectionData,
  ConnectionStats,
} from "./types/index.js";
import redisClient, {
  RedisClientTypeInstance,
} from "@/config/redis.js";
import debugLib from "debug";
import { Socket } from "socket.io";
import { randomBytes } from "crypto";

const debug = debugLib("server/services:socketio:connection-manager");

/**
 * Redis-based Socket.IO connection manager for distributed scaling.
 */
export class SocketIOConnectionManager {
  private readonly serverId: string;
  private readonly statsKey: string;
  private readonly maxConnections: number;
  private readonly pingKey = "socketio:ping_awaiting";
  private readonly connectionsKey = "socketio:connections";
  private readonly redis: RedisClientTypeInstance = redisClient;
  private readonly localSockets: Map<string, Socket> = new Map();

  // Cleanup intervals
  private pingInterval?: NodeJS.Timeout;
  private cleanupInterval?: NodeJS.Timeout;
  private staleCleanupInterval?: NodeJS.Timeout;

  constructor(maxConnections: number = 1000, serverId?: string) {
    const defaultId = `server_${randomBytes(4).toString("hex")}`;
    this.maxConnections = maxConnections;
    this.serverId = serverId || defaultId;
    this.statsKey = `socketio:stats:${this.serverId}`;

    debug(
      `Socket.IO Connection Manager initialized with server_id: ${this.serverId}`
    );
  }

  /**
   * Register a new Socket.IO connection and store it in Redis.
   * Call this in your socket connection handler.
   */
  async registerConnection(
    socket: Socket,
    namespace: string
  ): Promise<string> {
    const totalConnections = await this.getTotalConnections();

    if (totalConnections >= this.maxConnections) {
      socket.disconnect(true);
      throw new Error("Maximum connections exceeded");
    }

    const connectionId = `${this.serverId}:${socket.id}`;

    // Store socket locally
    this.localSockets.set(connectionId, socket);

    // Extract client info
    const clientInfo: ClientInfo = {
      address: socket.handshake.address,
      referer: socket.handshake.headers.referer,
      userAgent: socket.handshake.headers["user-agent"],
    };

    const connectionData: ConnectionData = {
      namespace,
      status: "active",
      socket_id: socket.id,
      client_info: clientInfo,
      server_id: this.serverId,
      last_seen: Date.now() / 1000,
      connected_at: Date.now() / 1000,
    };

    await this.redis.hSet(
      this.connectionsKey,
      connectionId,
      JSON.stringify(connectionData)
    );

    // Update server stats
    await this.updateServerStats();

    // Set up socket event handlers
    this.setupSocketHandlers(socket, connectionId);

    debug(
      `New connection registered: ${connectionId}. Total connections: ${
        totalConnections + 1
      }`
    );

    return connectionId;
  }

  /**
   * Set up Socket.IO event handlers for connection management.
   */
  private setupSocketHandlers(
    socket: Socket,
    connectionId: string
  ): void {
    // Handle pong responses
    socket.on("pong", async () => {
      await this.handlePong(connectionId);
    });

    // Update last seen on any activity
    socket.onAny(async () => {
      await this.updateLastSeen(connectionId);
    });

    // Handle disconnection
    socket.on("disconnect", async (reason) => {
      debug(
        `Socket disconnected: ${connectionId}. Reason: ${reason}`
      );
      await this.unregisterConnection(connectionId);
    });

    // Handle errors
    socket.on("error", (error) => {
      debug(`Socket error for ${connectionId}:`, error);
    });
  }

  /**
   * Remove a Socket.IO connection from local and Redis storage.
   */
  async unregisterConnection(connectionId: string): Promise<void> {
    if (this.localSockets.has(connectionId)) {
      this.localSockets.delete(connectionId);
    }

    await this.redis.hDel(this.pingKey, connectionId);
    await this.redis.hDel(this.connectionsKey, connectionId);

    // Update server stats
    await this.updateServerStats();

    const totalConnections = await this.getTotalConnections();
    debug(
      `Connection unregistered: ${connectionId}. Total connections: ${totalConnections}`
    );
  }

  /**
   * Get connection data from Redis by ID.
   */
  async getConnectionById(
    connectionId: string
  ): Promise<ConnectionData | null> {
    const connectionData = await this.redis.hGet(
      this.connectionsKey,
      connectionId
    );

    if (connectionData) {
      try {
        return JSON.parse(connectionData) as ConnectionData;
      } catch (error) {
        debug("Failed to parse connection data:", error);
        return null;
      }
    }

    return null;
  }

  /**
   * Get all connection IDs managed by this server from Redis.
   */
  async getLocalConnections(): Promise<string[]> {
    const allConnections = await this.redis.hGetAll(
      this.connectionsKey
    );
    const localConnections: string[] = [];

    for (const [connectionId, connectionDataStr] of Object.entries(
      allConnections
    )) {
      try {
        const connectionData = JSON.parse(
          connectionDataStr
        ) as ConnectionData;
        if (connectionData.server_id === this.serverId) {
          localConnections.push(connectionId);
        }
      } catch (error) {
        continue;
      }
    }

    return localConnections;
  }

  /**
   * Update the last seen time for a connection in Redis.
   */
  async updateLastSeen(connectionId: string): Promise<void> {
    const connectionData = await this.redis.hGet(
      this.connectionsKey,
      connectionId
    );

    if (connectionData) {
      try {
        const data = JSON.parse(connectionData) as ConnectionData;
        data.last_seen = Date.now() / 1000;
        await this.redis.hSet(
          this.connectionsKey,
          connectionId,
          JSON.stringify(data)
        );
      } catch (error) {
        debug("Failed to update last seen:", error);
      }
    }
  }

  /**
   * Send a message to a specific Socket.IO connection.
   */
  async sendToSocket(
    event: string,
    data: any,
    connectionId: string
  ): Promise<boolean> {
    const socket = this.localSockets.get(connectionId);

    if (socket && socket.connected) {
      try {
        socket.emit(event, data);
        await this.updateLastSeen(connectionId);
        return true;
      } catch (error) {
        debug(`Failed to send to socket ${connectionId}:`, error);
        await this.unregisterConnection(connectionId);
        return false;
      }
    }

    return false;
  }

  /**
   * Send ping to all local connections and track responses in Redis.
   */
  async broadcastPing(): Promise<void> {
    const disconnected: string[] = [];
    const currentTime = Date.now() / 1000;
    const localConnectionIds = await this.getLocalConnections();
    const pingMessage: PingMessage = {
      type: "ping",
      timestamp: currentTime,
    };

    for (const connectionId of localConnectionIds) {
      const socket = this.localSockets.get(connectionId);

      if (socket && socket.connected) {
        try {
          socket.emit("ping", pingMessage);
          await this.redis.hSet(
            this.pingKey,
            connectionId,
            currentTime.toString()
          );
        } catch (error) {
          debug(`Could not send ping to ${connectionId}:`, error);
          disconnected.push(connectionId);
        }
      }
    }

    // Clean up failed connections
    for (const connectionId of disconnected) {
      await this.unregisterConnection(connectionId);
    }
  }

  /**
   * Handle pong response from a connection.
   */
  async handlePong(connectionId: string): Promise<void> {
    await this.redis.hDel(this.pingKey, connectionId);
    await this.updateLastSeen(connectionId);
    debug(`Received pong from ${connectionId}`);
  }

  /**
   * Start the ping service.
   */
  startPingService(pingIntervalInSeconds: number = 30): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }

    this.pingInterval = setInterval(async () => {
      await this.broadcastPing();
    }, pingIntervalInSeconds * 1000);

    debug(
      `Ping service started with ${pingIntervalInSeconds}s interval`
    );
  }

  /**
   * Start cleanup services.
   */
  startCleanupServices(
    checkIntervalInSeconds: number = 60,
    staleTimeoutInSeconds: number = 300
  ): void {
    // Cleanup unresponsive connections
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }

    this.cleanupInterval = setInterval(async () => {
      await this.cleanupUnresponsiveConnections(60);
    }, checkIntervalInSeconds * 1000);

    // Cleanup stale connections
    if (this.staleCleanupInterval) {
      clearInterval(this.staleCleanupInterval);
    }

    this.staleCleanupInterval = setInterval(async () => {
      await this.cleanupStaleConnections(staleTimeoutInSeconds);
    }, (staleTimeoutInSeconds / 2) * 1000);

    debug(`Cleanup services started`);
  }

  /**
   * Clean up connections that didn't respond to ping.
   */
  private async cleanupUnresponsiveConnections(
    timeout: number = 60
  ): Promise<void> {
    const deadConnections: string[] = [];
    const currentTime = Date.now() / 1000;
    try {
      const pingData = await this.redis.hGetAll(this.pingKey);

      for (const [connectionId, pingTimeStr] of Object.entries(
        pingData
      )) {
        try {
          const pingTime = parseFloat(pingTimeStr);

          if (currentTime - pingTime > timeout)
            deadConnections.push(connectionId);
        } catch (error) {
          deadConnections.push(connectionId);
        }
      }
    } catch (error) {
      debug("Failed to fetch ping data:", error);
      return;
    }

    // Clean up dead connections (only if they belong to this server)
    for (const connectionId of deadConnections) {
      const connectionData = await this.getConnectionById(
        connectionId
      );

      if (
        connectionData &&
        connectionData.server_id === this.serverId
      ) {
        debug(
          `Disconnecting unresponsive connection: ${connectionId}`
        );

        const socket = this.localSockets.get(connectionId);
        if (socket) socket.disconnect(true);

        await this.unregisterConnection(connectionId);
      } else if (!connectionData) {
        await this.redis.hDel(this.pingKey, connectionId);
      }
    }
  }

  /**
   * Clean up stale connections based on last_seen time.
   */
  private async cleanupStaleConnections(
    staleTimeout: number = 300
  ): Promise<void> {
    const currentTime = Date.now() / 1000;
    const allConnections = await this.redis.hGetAll(
      this.connectionsKey
    );
    const staleConnections: Array<[string, ConnectionData | null]> =
      [];

    for (const [connectionId, connectionDataStr] of Object.entries(
      allConnections
    )) {
      try {
        const connectionData = JSON.parse(
          connectionDataStr
        ) as ConnectionData;
        const lastSeen = connectionData.last_seen || 0;

        if (currentTime - lastSeen > staleTimeout) {
          staleConnections.push([connectionId, connectionData]);
        }
      } catch (error) {
        staleConnections.push([connectionId, null]);
      }
    }

    // Clean up stale connections on for this server
    for (const [connectionId, connectionData] of staleConnections) {
      if (
        connectionData &&
        connectionData.server_id === this.serverId
      ) {
        debug(`Disconnecting stale connection: ${connectionId}`);

        const socket = this.localSockets.get(connectionId);
        if (socket) {
          socket.disconnect(true);
        }

        await this.unregisterConnection(connectionId);
      } else if (!connectionData) {
        await this.redis.hDel(this.connectionsKey, connectionId);
        await this.redis.hDel(this.pingKey, connectionId);
        debug(`Cleaned up orphaned connection data: ${connectionId}`);
      }
    }
  }

  /**
   * Get the total number of connections across all servers.
   */
  private async getTotalConnections(): Promise<number> {
    return await this.redis.hLen(this.connectionsKey);
  }

  /**
   * Update this server's statistics in Redis.
   */
  private async updateServerStats(): Promise<void> {
    const localConnectionCount = (await this.getLocalConnections())
      .length;

    const stats: ServerStats = {
      server_id: this.serverId,
      last_updated: Date.now() / 1000,
      local_sockets: this.localSockets.size,
      local_connections: localConnectionCount,
    };

    await this.redis.hSet(
      this.statsKey,
      "stats",
      JSON.stringify(stats)
    );
  }

  /**
   * Get comprehensive connection statistics.
   */
  async getConnectionStats(): Promise<ConnectionStats> {
    const totalConnections = await this.getTotalConnections();
    const localConnections = (await this.getLocalConnections())
      .length;
    const localSockets = this.localSockets.size;

    // Get all server stats
    const serverKeys = await this.redis.keys("socketio:stats:*");
    const serverStats: ServerStats[] = [];

    for (const key of serverKeys) {
      const statsData = await this.redis.hGet(key, "stats");
      if (statsData) {
        try {
          serverStats.push(JSON.parse(statsData) as ServerStats);
        } catch (error) {
          continue;
        }
      }
    }

    const pingAwaiting = await this.redis.hLen(this.pingKey);

    return {
      server_id: this.serverId,
      server_stats: serverStats,
      ping_awaiting: pingAwaiting,
      local_sockets: localSockets,
      total_connections: totalConnections,
      local_connections: localConnections,
      max_connections: this.maxConnections,
      utilization_percent:
        (totalConnections / this.maxConnections) * 100,
    };
  }

  /**
   * Clean up all connections and stop services on shutdown.
   */
  async shutdown(): Promise<void> {
    debug(
      `Shutting down connection manager for server ${this.serverId}`
    );

    // Stop intervals
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.cleanupInterval) clearInterval(this.cleanupInterval);
    if (this.staleCleanupInterval)
      clearInterval(this.staleCleanupInterval);

    // Disconnect all local sockets
    const localConnectionIds = await this.getLocalConnections();

    for (const connectionId of localConnectionIds) {
      const socket = this.localSockets.get(connectionId);
      if (socket) {
        socket.disconnect(true);
      }
      await this.unregisterConnection(connectionId);
    }

    // Clean up server stats
    await this.redis.del(this.statsKey);

    debug("Connection manager shutdown complete");
  }
}

// Global instance
export const socketIOConnectionManager =
  new SocketIOConnectionManager();
