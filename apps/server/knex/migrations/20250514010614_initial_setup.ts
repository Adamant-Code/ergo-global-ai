import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Enable uuid-ossp extension for UUID generation
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

  // Enable pgvector extension (from init.sql)
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "vector"');

  // Create AdminRole enum
  await knex.schema.raw(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'adminrole') THEN
        CREATE TYPE "AdminRole" AS ENUM ('VIEWER', 'EDITOR', 'SUPER_ADMIN');
      END IF;
    END $$;
  `);

  // Create User table
  await knex.schema.createTable("User", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });

  // Create AdminUser table
  await knex.schema.createTable("AdminUser", (table) => {
    table
      .uuid("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.specificType("role", '"AdminRole"').defaultTo("VIEWER");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });

  // Create sessions table
  await knex.schema.createTable("sessions", (table) => {
    table.string("sid").primary();
    table.jsonb("sess").notNullable();
    table.timestamp("expire").notNullable();
    table.index("expire", "IDX_session_expire");
  });

  // Create Log table
  await knex.schema.createTable("Log", (table) => {
    table.increments("id").primary();
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
    table.string("recordId", 128).notNullable();
    table.string("recordTitle", 128);
    table.json("difference");
    table.string("action", 128).notNullable();
    table.string("resource", 128).notNullable();
    table.string("userId", 128).notNullable();
    table.index("userId", "Log_userId_idx");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTable("Log")
    .dropTable("sessions")
    .dropTable("AdminUser")
    .dropTable("User");
  await knex.schema.raw('DROP TYPE IF EXISTS "AdminRole"'); // This one also needs to be quoted to match the creation
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
  await knex.raw('DROP EXTENSION IF EXISTS "vector"');
}
