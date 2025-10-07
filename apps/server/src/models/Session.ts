import { BaseModel } from "./BaseModel.js";

export class Session extends BaseModel {
  static get tableName() {
    return "sessions";
  }

  static get idColumn() {
    return "sid";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["sid", "sess", "expire"],
      properties: {
        sid: { type: "string" },
        sess: { type: "object" },
        expire: { type: "string", format: "date-time" },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
      },
    };
  }

  sid!: string;
  expire!: string;
  sess!: Record<string, any>;
}
