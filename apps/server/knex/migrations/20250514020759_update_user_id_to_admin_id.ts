import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("Log", (table) => {
    table.dropColumn("userId");
    table.string("adminId", 128).notNullable();
    table.index("adminId", "Log_adminId_idx");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("Log", (table) => {
    table.dropColumn("adminId");
    table.string("userId", 128).notNullable();
    table.index("userId", "Log_userId_idx");
  });
}
