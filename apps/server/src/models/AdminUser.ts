import { BaseModel } from "./BaseModel.js";
import { AdminRole } from "@/constants/adminUsers.js";

export class AdminUser extends BaseModel {
  static get tableName() {
    return "AdminUser";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password", "role"],
      properties: {
        id: { type: "string", format: "uuid" },
        password: { type: "string", minLength: 1 },
        role: {
          type: "string",
          enum: ["VIEWER", "EDITOR", "SUPER_ADMIN"],
        },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        email: { type: "string", format: "email", maxLength: 255 },
      },
    };
  }

  id!: string;
  email!: string;
  role!: AdminRole;
  password!: string;
}
