const db = require("./db");

// Query all transactions or filter by type
// const findTransactionsByUserId = async (user_id, type = null) => {
//   const query = `
//     SELECT * FROM transactions
//     WHERE user_id = ?
//     ${type ? "AND type = ?" : ""}
//     ORDER BY created_at DESC;
//   `;

//   const params = type ? [user_id, type] : [user_id];
//   const [results] = await db.execute(query, params);
//   return results;
// };
const findTransactionsByUserId = async (user_id, type = null) => {
  const query = `
    SELECT * FROM transactions
    WHERE user_id = ?
    ${type ? "AND type = ?" : ""}
    ORDER BY created_at DESC;
  `;

  const params = type ? [user_id, type] : [user_id];
  const results = await db.raw(query, params); // Knex uses db.raw for raw SQL queries
  return results[0]; // Knex raw query results are returned in an array
};

module.exports = { findTransactionsByUserId };
