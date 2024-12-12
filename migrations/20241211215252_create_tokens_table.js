/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.increments("token_id").primary(); 
    table.string("refreshToken", 100).notNullable(); 
    table.string("ip", 100).notNullable(); 
    table.string("userAgent", 100).notNullable(); 
    table.boolean("isValid").notNullable(); 
    table
      .integer("user")
      .unsigned()
      .references("user_id") 
      .inTable("users")
      .onDelete("CASCADE"); 

    table.timestamps(true, true); 
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("token"); 
};
