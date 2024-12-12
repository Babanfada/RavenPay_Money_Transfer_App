/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("transaction_id").primary(); 
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("user_id")
      .inTable("users")
      .onDelete("CASCADE"); 
    table
      .integer("account_id")
      .unsigned()
      .notNullable()
      .references("act_id")
      .inTable("bank_accounts")
      .onDelete("CASCADE"); // Foreign key to bank accounts
    table.enu("type", ["deposit", "transfer"]).notNullable(); // Transaction type
    table.decimal("amount", 15, 2).notNullable(); // Transaction amount
    table.string("reference", 100).notNullable().unique(); // Unique transaction reference
    table.enu("status", ["pending", "completed", "failed"]).notNullable(); // Status of the transaction
    table.timestamps(true, true); // created_at and updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
