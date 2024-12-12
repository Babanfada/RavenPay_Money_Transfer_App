/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("bank_accounts", (table) => {
    table.increments("act_id").primary();
    table.integer("user_id").unsigned().notNullable();
    table.string("account_number", 20).notNullable().unique();
    table.decimal("balance", 15, 2).notNullable().defaultTo(0.0);
    table.timestamps(true, true);

    table
      .foreign("user_id")
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("bank_accounts");
};
