export interface ClientInfo {
  address: string;
  referer?: string;
  userAgent?: string;
}

export interface ConnectionData {
  status: string;
  last_seen: number;
  server_id: string;
  namespace: string;
  socket_id: string;
  connected_at: number;
  client_info: ClientInfo;
}

export interface ServerStats {
  server_id: string;
  last_updated: number;
  local_sockets: number;
  local_connections: number;
}

export interface ConnectionStats {
  server_id: string;
  ping_awaiting: number;
  local_sockets: number;
  max_connections: number;
  total_connections: number;
  local_connections: number;
  server_stats: ServerStats[];
  utilization_percent: number;
}

export interface PingMessage {
  type: "ping";
  timestamp: number;
}
