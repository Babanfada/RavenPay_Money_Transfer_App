const db = require("./db");

// Query all transactions or filter by type
const findTransactionsByUserId = async (user_id, type = null) => {
  const query = `
    SELECT * FROM transactions
    WHERE user_id = ?
    ${type ? "AND type = ?" : ""}
    ORDER BY created_at DESC;
  `;

  const params = type ? [user_id, type] : [user_id];
  const [results] = await db.execute(query, params);
  return results;
};

module.exports = { findTransactionsByUserId };
