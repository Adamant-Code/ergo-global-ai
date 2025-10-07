import { BaseModel } from "./BaseModel.js";

export class Log extends BaseModel {
  static get tableName() {
    return "Log";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["recordId", "action", "resource", "adminId"],
      properties: {
        difference: {},
        id: { type: "integer" },
        action: { type: "string", maxLength: 128 },
        adminId: { type: "string", maxLength: 128 },
        recordId: { type: "string", maxLength: 128 },
        resource: { type: "string", maxLength: 128 },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        recordTitle: {
          type: "string",
          maxLength: 128,
          nullable: true,
        },
      },
    };
  }

  id!: number;
  action!: string;
  adminId!: string;
  recordId!: string;
  resource!: string;
  recordTitle!: string | null;
  difference!: Record<string, any> | null;
}
