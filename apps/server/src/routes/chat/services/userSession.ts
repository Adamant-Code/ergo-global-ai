import debugLib from "debug";
import { Socket } from "socket.io";
import { socketIOConnectionManager } from "./connectionManager.js";
import { getOrCreateConversation } from "../libs/crud.js";

const debug = debugLib("server/services:socketio:user-session");

/**
 * Redis-based user session management for Socket.IO connections.
 * Provides a Socket.IO wrapper with Redis-backed connection management.
 */
export class UserSession {
  private socket: Socket;
  private namespace: string;
  private isConnected: boolean = false;
  private connectionId: string | null = null;

  constructor(socket: Socket, namespace: string = "/") {
    this.socket = socket;
    this.namespace = namespace;
  }

  /**
   * Connect the Socket.IO session and register with Redis connection manager.
   * Returns the connection ID.
   */
  async connect(): Promise<string> {
    try {
      this.connectionId =
        await socketIOConnectionManager.registerConnection(
          this.socket,
          this.namespace
        );
      this.isConnected = true;

      // Set up session-specific handlers
      this.setupSessionHandlers();

      debug(`User session connected with ID: ${this.connectionId}`);
      return this.connectionId;
    } catch (error) {
      debug(`Failed to connect user session:`, error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Set up Socket.IO event handlers specific to this session.
   */
  private setupSessionHandlers(): void {
    // Handle pong responses
    this.socket.on("pong", async () => {
      await this.handlePong();
    });

    // Handle session-specific disconnection
    this.socket.on("disconnect", async (reason) => {
      debug(
        `User session disconnected: ${this.connectionId}. Reason: ${reason}`
      );
      await this.disconnect();
    });

    // Handle errors
    this.socket.on("error", (error) => {
      debug(`Socket error for session ${this.connectionId}:`, error);
    });
  }

  /**
   * Disconnect the Socket.IO session and clean up Redis data.
   */
  async disconnect(): Promise<void> {
    if (this.connectionId && this.isConnected) {
      await socketIOConnectionManager.unregisterConnection(
        this.connectionId
      );
      this.isConnected = false;
      debug(`User session disconnected: ${this.connectionId}`);
    }
  }

  /**
   *  Return user id from the session data.
   */
  getUserId() {
    return this.socket.data.user?.userId as string;
  }

  /**
   * Get or create a conversation for the user.
   * If conversationId is provided, it will fetch that conversation.
   * Otherwise, it will create a new conversation.
   */
  async getOrCreateConversation(conversationId?: string) {
    const userId = this.getUserId();
    return getOrCreateConversation(userId, conversationId);
  }

  /**
   * Send an event with data through the Socket.IO connection.
   */
  async emit(event: string, data: Object): Promise<boolean> {
    if (!this.isConnected || !this.connectionId) {
      debug("Attempted to emit on disconnected session");
      return false;
    }

    const success = await socketIOConnectionManager.sendToSocket(
      event,
      data,
      this.connectionId
    );

    if (!success) {
      this.isConnected = false;
    }

    return success;
  }

  /**
   * Send an error message to the client.
   */
  async sendError(
    error: Error,
    payload: object = {}
  ): Promise<boolean> {
    const errorMessage = {
      type: "error",
      error: error.message,
      error_type: error.constructor.name,
      timestamp: Date.now(),
      ...payload,
    };

    return await this.emit("error", errorMessage);
  }

  /**
   * Update the last seen timestamp in Redis.
   */
  async updateLastSeen(): Promise<void> {
    if (this.connectionId && this.isConnected) {
      await socketIOConnectionManager.updateLastSeen(
        this.connectionId
      );
    }
  }

  /**
   * Handle pong response from the client.
   */
  async handlePong(): Promise<void> {
    if (this.connectionId && this.isConnected) {
      await socketIOConnectionManager.handlePong(this.connectionId);
      debug(`Received pong from session ${this.connectionId}`);
    }
  }

  /**
   * Set up a listener for a specific event from this session.
   */
  on(event: string, handler: (...args: any[]) => void): void {
    this.socket.on(event, async (...args) => {
      await this.updateLastSeen();
      handler(...args);
    });
  }

  /**
   * Remove a listener for a specific event.
   */
  off(event: string, handler?: (...args: any[]) => void): void {
    if (handler) {
      this.socket.off(event, handler);
    } else {
      this.socket.removeAllListeners(event);
    }
  }

  /**
   * Listen to all events from this session.
   */
  onAny(handler: (event: string, ...args: any[]) => void): void {
    this.socket.onAny(async (event, ...args) => {
      await this.updateLastSeen();
      handler(event, ...args);
    });
  }

  /**
   * Get the connection ID.
   */
  getConnectionId(): string | null {
    return this.connectionId;
  }

  /**
   * Get the Socket.IO socket ID.
   */
  getSocketId(): string {
    return this.socket.id;
  }

  /**
   * Get the namespace this session belongs to.
   */
  getNamespace(): string {
    return this.namespace;
  }

  /**
   * Check if the session is connected.
   */
  isSessionConnected(): boolean {
    return (
      this.isConnected &&
      this.connectionId !== null &&
      this.socket.connected
    );
  }

  /**
   * Get client information.
   */
  getClientInfo(): {
    address: string;
    rooms: string[];
    referer?: string;
    userAgent?: string;
  } {
    return {
      rooms: Array.from(this.socket.rooms),
      address: this.socket.handshake.address,
      referer: this.socket.handshake.headers.referer,
      userAgent: this.socket.handshake.headers["user-agent"],
    };
  }

  /**
   * Get session statistics.
   */
  getSessionStats(): {
    socketId: string;
    namespace: string;
    connectedAt: Date;
    isConnected: boolean;
    clientInfo: {
      address: string;
      rooms: string[];
      referer?: string;
      userAgent?: string;
    };
    connectionId: string | null;
  } {
    return {
      socketId: this.socket.id,
      namespace: this.namespace,
      isConnected: this.isConnected,
      connectionId: this.connectionId,
      clientInfo: this.getClientInfo(),
      connectedAt: new Date(this.socket.handshake.time),
    };
  }
}
