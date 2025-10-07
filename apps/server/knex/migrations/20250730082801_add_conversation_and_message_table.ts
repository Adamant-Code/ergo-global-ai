import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("conversations", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table
      .uuid("userId")
      .index()
      .references("id")
      .inTable("User")
      .onDelete("CASCADE");
    table.string("title").nullable();
    table
      .timestamp("createdAt", { useTz: true })
      .defaultTo(knex.fn.now());
    table
      .timestamp("updatedAt", { useTz: true })
      .defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table
      .uuid("conversationId")
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE")
      .index();
    table.string("role");
    table.text("content");
    table
      .timestamp("createdAt", { useTz: true })
      .defaultTo(knex.fn.now());
    table
      .timestamp("updatedAt", { useTz: true })
      .defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("messages");
  await knex.schema.dropTableIfExists("conversations");
}
