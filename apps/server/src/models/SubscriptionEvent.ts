import { Model } from "objection";

export class SubscriptionEvent extends Model {
  static get idColumn() {
    return "id";
  }

  static get tableName() {
    return "subscription_events";
  }

  static get jsonSchema() {
    return {
      type: "object",
      properties: {
        id: { type: "integer" },
        payload: { type: "object" },
        subscription_id: { type: ["integer", "null"] },
        event_type: { type: "string", maxLength: 100 },
        stripe_event_id: { type: "string", maxLength: 255 },
        created_at: { type: "string", format: "date-time" },
      },
      required: ["stripe_event_id", "event_type", "payload"],
    };
  }

  id!: number;
  payload!: object;
  created_at!: string;
  event_type!: string;
  stripe_event_id!: string;
  subscription_id?: number | null;
}
