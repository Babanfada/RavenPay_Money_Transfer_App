
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("user_id").primary(); // Auto-increment primary key
    table.string("name", 100).notNullable(); // User's name
    table.string("email", 255).notNullable().unique(); // User's email
    table.string("password", 255).notNullable(); // Hashed password
    table.string("phone", 30).notNullable().unique(); // Phone number
    table.enu("gender", ["male", "female"]).defaultTo("male"); // Gender enum
    table.text("verificationString"); // Verification string
    table.boolean("isVerified").notNullable().defaultTo(false); // Verification status
    table.timestamp("verified"); // Verified timestamp
    table.text("passwordToken"); // Password reset token
    table.timestamp("passwordExpirationDate"); // Token expiration timestamp
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users"); // Rollback operation
};
