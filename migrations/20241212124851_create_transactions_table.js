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
      .onDelete("CASCADE"); 
    table.enu("type", ["deposit", "transfer"]).notNullable(); 
    table.decimal("amount", 15, 2).notNullable(); 
    table.string("reference", 100).notNullable().unique(); 
    table.enu("status", ["pending", "completed", "failed"]).notNullable(); 
    table.timestamps(true, true); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
