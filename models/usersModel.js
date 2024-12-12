const bcrypt = require("bcryptjs");
const db = require("./db");
const crypto = require("crypto");

// Find a user by email
const findUserByEmail = async (email) => {
  return await db("users").where({ email }).first();
};

// Count total users
const countUsers = async () => {
  return await db("users").count("* as count").first();
};

// Insert a new user
const createUserObject = async (userObject) => {
  const salt = await bcrypt.genSalt(10);
  userObject.password = await bcrypt.hash(userObject.password, salt);
  const [user] = await db("users").insert(userObject).returning("*");
  return user;
};
// Compare the hashed password with the provided password
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// Update user data by email
const updateUserByEmail = async (email, updates) => {
  const query = db("users").where({ email }).update(updates);
  await query;
  const [updatedUser] = await db("users").where({ email }).select("*");
  return updatedUser;
};
// Export functions
module.exports = {
  findUserByEmail,
  countUsers,
  createUserObject,
  comparePassword,
  updateUserByEmail
};
