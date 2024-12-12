const db = require("./db");
const findTransaction = async (reference) => {
  return await db("transactions")
    .where({
      reference,
    })
    .first();
};

const createTransaction = async (transaction) => {
  await db("transactions").insert(transaction);
};
module.exports = { findTransaction, createTransaction };
