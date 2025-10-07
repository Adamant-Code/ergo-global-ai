import "dotenv/config";
import { AdminUserSeed } from "@/types/auth/index.js";

const superAdminPassword =
  process.env.SUPER_ADMIN_PASSWORD || "P@ssword123";
const superAdminEmail =
  process.env.SUPER_ADMIN_EMAIL || "devuser@example.com";

export enum AdminRole {
  VIEWER = "VIEWER",
  EDITOR = "EDITOR",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export const adminUsers: AdminUserSeed[] = [
  // SUPER_ADMIN user
  {
    email: superAdminEmail,
    password: superAdminPassword,
    role: AdminRole.SUPER_ADMIN,
  },
  // EDITOR users
  {
    email: "editor1@example.com",
    password: "P@ssword123",
    role: AdminRole.EDITOR,
  },
  {
    email: "editor2@example.com",
    password: "P@ssword123",
    role: AdminRole.EDITOR,
  },
  // VIEWER users
  {
    email: "viewer1@example.com",
    password: "P@ssword123",
    role: AdminRole.VIEWER,
  },
  {
    email: "viewer2@example.com",
    password: "P@ssword123",
    role: AdminRole.VIEWER,
  },
  {
    email: "viewer3@example.com",
    password: "P@ssword123",
    role: AdminRole.VIEWER,
  },
  {
    email: "viewer4@example.com",
    password: "P@ssword123",
    role: AdminRole.VIEWER,
  },
  {
    email: "viewer5@example.com",
    password: "P@ssword123",
    role: AdminRole.VIEWER,
  },
];
