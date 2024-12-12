
// Update with your config settings.
require("dotenv").config();

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "127.0.0.1",
      port: 3306,
      user: process.env.DB_USERNAME || "root",
      password: process.env.DB_PASSWORD || "BabanFad@92",
      database: process.env.DB_DATABASE || "ravenpay",
    },
  },
};
