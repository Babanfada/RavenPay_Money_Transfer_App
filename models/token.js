const db = require("./db");
const findToken = async ({ user_id, refreshToken }) => {
  return await db("tokens")
    .where({
      user: user_id,
      refreshToken: refreshToken,
    })
    .first();
};
const findTokenByUserId = async (user_id) => {
  return await db("tokens")
    .where({
      user: user_id,
    })
    .first();
};

const createToken = async ({ refreshToken, userAgent, ip, user }) => {
  await db("tokens").insert({
    refreshToken,
    userAgent,
    ip,
    user,
    isValid: true,
  });
};
const deleteToken = async ({ user }) => {
  await db("tokens").where({ user }).delete();
};

module.exports = { findToken, findTokenByUserId, createToken, deleteToken };
