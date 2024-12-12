/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
return knex.schema.alterTable("bank_accounts", (table) => {
  table.string("account_name").notNullable(); 
  table.string("bank").notNullable(); 
  table.decimal("amount", 15, 2).defaultTo(0.0); 
  table.boolean("is_permanent").notNullable().defaultTo(false); 
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable("bank_accounts", (table) => {
    table.dropColumn("account_name");
    table.dropColumn("bank");
    table.dropColumn("amount");
    table.dropColumn("is_permanent");
  });
};
