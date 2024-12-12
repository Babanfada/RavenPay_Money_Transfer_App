/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("bank_accounts", (table) => {
    table.increments("act_id").primary(); // Auto-increment ID
    table.integer("user_id").unsigned().notNullable(); // Foreign key to users table
    table.string("account_number", 20).notNullable().unique(); // Unique account number
    table.decimal("balance", 15, 2).notNullable().defaultTo(0.0); // Default balance
    table.timestamps(true, true); // created_at and updated_at timestamps

    // Foreign key constraint
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
exports.down = function(knex) {
   return knex.schema.dropTable("bank_accounts");
};
