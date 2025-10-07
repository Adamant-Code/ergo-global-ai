import { BaseModel } from "./BaseModel.js";

export class Message extends BaseModel {
  static get idColumn() {
    return "id";
  }

  static get tableName() {
    return "messages";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        role: { type: "string" },
        content: { type: "string" },
        conversationId: { type: "string", format: "uuid" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: [
        "role",
        "content",
        "createdAt",
        "updatedAt",
        "conversationId",
      ],
    };
  }

  id!: number;
  role!: string;
  content!: string;
  conversationId!: string;
}
