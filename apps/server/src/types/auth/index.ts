import { Request } from "express";
import { AdminRole } from "@/constants/adminUsers.js";

export interface JwtPayload {
  userId: string;
  // Add optional fields as needed
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export interface IpAndUserAgentProps {
  ipAddress?: string;
  userAgent?: string;
}

export interface TokenMetadata extends IpAndUserAgentProps {
  userId: string;
  lastUsed: number;
  createdAt: number;
}

export interface AdminUserSeed {
  email: string;
  role: AdminRole;
  password: string;
}

export type UserSeed = Pick<AdminUserSeed, "email" | "password">;
