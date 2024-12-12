/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("tokens", (table) => {
    table.increments("token_id").primary(); // Primary key with auto-increment
    table.string("refreshToken", 100).notNullable(); // Refresh token, required
    table.string("ip", 100).notNullable(); // IP address, required
    table.string("userAgent", 100).notNullable(); // User agent, required
    table.boolean("isValid").notNullable(); // Validity status, required
    table
      .integer("user")
      .unsigned()
      .references("user_id") // Foreign key references users(user_id)
      .inTable("users")
      .onDelete("CASCADE"); // Cascade delete when user is deleted

    table.timestamps(true, true); // Adds created_at and updated_at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("token"); // Rollback: drops the table
};
