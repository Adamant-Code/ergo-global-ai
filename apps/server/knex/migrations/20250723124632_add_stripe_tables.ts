import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Add stripe_customer_id to existing User table
  await knex.schema.alterTable("User", (table) => {
    table.string("stripe_customer_id", 255).nullable().unique();
  });

  // Create subscriptions table
  await knex.schema.createTable("subscriptions", (table) => {
    table.increments("id").primary();
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("User")
      .onDelete("CASCADE");
    table
      .string("stripe_subscription_id", 255)
      .notNullable()
      .unique();
    table.string("stripe_price_id", 255).notNullable();
    table.string("status", 50).notNullable();
    table.timestamp("current_period_start").notNullable();
    table.timestamp("current_period_end").notNullable();
    table.timestamp("trial_end").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });

  // Create subscription_events table
  await knex.schema.createTable("subscription_events", (table) => {
    table.increments("id").primary();
    table
      .integer("subscription_id")
      .unsigned()
      .references("id")
      .inTable("subscriptions")
      .onDelete("SET NULL");
    table.string("stripe_event_id", 255).notNullable().unique();
    table.string("event_type", 100).notNullable();
    table.jsonb("payload").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("subscription_events");
  await knex.schema.dropTableIfExists("subscriptions");
  await knex.schema.alterTable("User", (table) => {
    table.dropColumn("stripe_customer_id");
  });
}
