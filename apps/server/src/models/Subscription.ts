import { Model } from "objection";

export class Subscription extends Model {
  static get idColumn() {
    return "id";
  }

  static get tableName() {
    return "subscriptions";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "status",
        "user_id",
        "stripe_price_id",
        "current_period_end",
        "current_period_start",
        "stripe_subscription_id",
      ],
      properties: {
        id: { type: "integer" },
        status: { type: "string", maxLength: 50 },
        user_id: { type: "string", format: "uuid" },
        stripe_price_id: { type: "string", maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
        updated_at: { type: "string", format: "date-time" },
        stripe_subscription_id: { type: "string", maxLength: 255 },
        current_period_end: { type: "string", format: "date-time" },
        trial_end: { type: ["string", "null"], format: "date-time" },
        current_period_start: { type: "string", format: "date-time" },
      },
    };
  }

  id!: number;
  status!: string;
  user_id!: string;
  created_at!: string;
  updated_at!: string;
  stripe_price_id!: string;
  trial_end?: string | null;
  current_period_end!: string;
  current_period_start!: string;
  stripe_subscription_id!: string;
}
