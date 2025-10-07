import { BaseModel } from "./BaseModel.js";

export class User extends BaseModel {
  static get tableName() {
    return "User";
  }

  static get idColumn() {
    return "id";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email", "password"],
      properties: {
        id: { type: "string", format: "uuid" },
        password: { type: "string", minLength: 1 },
        createdAt: { type: "string", format: "date-time" },
        updatedAt: { type: "string", format: "date-time" },
        stripe_customer_id: { type: "string", nullable: true },
        email: { type: "string", format: "email", maxLength: 255 },
      },
    };
  }

  id!: string;
  email!: string;
  password!: string;
  stripe_customer_id?: string;
}
