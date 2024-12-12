/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
return knex.schema.table("transactions", (table) => {
  table.string("recipient_bank").nullable(); // Bank of the recipient
  table.string("recipient_account").nullable(); // Account of the recipient
});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
return knex.schema.table("transactions", (table) => {
  table.dropColumn("recipient_bank");
  table.dropColumn("recipient_account");
});
};