import { Model, RelationMappings } from "objection";
import { BaseModel } from "./BaseModel.js";
import { Message } from "./Message.js";

export class Conversation extends BaseModel {
  static get idColumn() {
    return "id";
  }

  static get tableName() {
    return "conversations";
  }

  static relationMappings: RelationMappings = {
    messages: {
      modelClass: Message,
      relation: Model.HasManyRelation,
      join: {
        from: "conversations.id",
        to: "messages.conversationId",
      },
    },
  };

  static get jsonSchema() {
    return {
      type: "object",
      required: ["userId", "createdAt", "updatedAt"],
      properties: {
        title: { type: ["string", "null"] },
        id: { type: "string", format: "uuid" },
        userId: { type: "string", format: "uuid" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    };
  }

  id!: string;
  userId!: string;
  messages?: Message[];
  title?: string | null;
}
