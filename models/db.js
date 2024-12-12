const Knex = require("knex");
const knexConfig = require("../knexfile");

const environment = process.env.NODE_ENV || "development"; // Default to 'development'
const db = Knex(knexConfig[environment]);

module.exports = db;
