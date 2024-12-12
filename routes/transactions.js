const express = require("express");
const {
  getAllTransactions,
  getTransactionsByType,
} = require("../controllers/transfer");
const { authenticated } = require("../middlewares/authentication");

const router = express.Router();

// Route for all transactions
router.get("/", authenticated, getAllTransactions);

// Route for transactions by type
router.get("/:type", authenticated, getTransactionsByType);

module.exports = router;
