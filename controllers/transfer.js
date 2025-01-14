const axios = require("axios");
const qs = require("qs");
const db = require("../models/db");
const { BAD_REQUEST } = require("../middlewares/customErrors");
const {  triggerWebhook } = require("../models/webhook");
const {
  findBankAccountByUserId,
  updateBankAccount,
} = require("../models/bank_account");
const { findTransactionsByUserId, createTransaction } = require("../models/transactions");

const sendMoneyToOtherBanks = async (req, res) => {
  const userId = req.user.user_id;
  const { recipient_bank, recipient_account, amount } = req.body;

  // Validate input
  if (!recipient_bank || !recipient_account || !amount || amount <= 0) {
    throw new BAD_REQUEST("Invalid input. Ensure all fields are valid.");
  }

  // Ensure the user has sufficient balance
  const userAccount = await findBankAccountByUserId({ user_id: userId });
  if (!userAccount || userAccount.balance < amount) {
    throw new BAD_REQUEST("Insufficient balance.");
  }

  const ravenApiKey = process.env.RAVEN_ATLAS_API_KEY;
  const ravenApiUrl =
    "https://integrations.getravenbank.com/v1/transfers/create";

  try {
    const data = qs.stringify({
      amount: amount,
      bank: recipient_bank,
      account_number: recipient_account,
      account_name: userAccount.account_name,
      bank_code: "044",
      narration: "Transfer",
      reference: "9967998",
      currency: "NGN",
    });

    const config = {
      method: "post",
      url: ravenApiUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${ravenApiKey}`,
      },
      data: data,
    };

    const response = await axios(config);

    // Log the transaction
    const newTransaction = {
      user_id: userId,
      account_id: userAccount.act_id,
      narration: response.data.data.narration,
      amount: response.data.data.amount,
      reference: response.data.data.trx_ref,
      status: response.data.status || "pending",
      recipient_bank: response.data.data.bank,
      recipient_account: response.data.data.account_number,
    };

    const [transactionId] = await createTransaction(newTransaction);

    // Deduct the balance from the sender's account
    await updateBankAccount(userId, { balance: userAccount.balance - amount });

    // Trigger webhook
    await triggerWebhook({
      event: "transfer",
      data: {
        transactionId,
        ...newTransaction,
      },
    });

    // Respond with success
    res.status(201).json({
      message: "Transfer successful.",
      transaction: { id: transactionId, ...newTransaction },
    });
  } catch (error) {
    console.error("Transfer error:", error.message);
    // Trigger webhook for failed transfer
    await triggerWebhook({
      event: "transfer_failed",
      data: {
        userId,
        recipient_bank,
        recipient_account,
        amount,
        error: error.message,
      },
    });

    throw new BAD_REQUEST("Transfer failed. Please try again.");
  }
};

const getAllTransactions = async (req, res) => {
  const userId = req.user.user_id;

  try {
    // Query transactions for the authenticated user
    const transactions = await findTransactionsByUserId(userId);

    if (!transactions.length) {
      return res.status(404).json({ message: "No transactions found." });
    }

    res.status(200).json({
      message: "Transactions retrieved successfully.",
      transactions,
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error.message);
    res.status(500).json({ message: "Failed to retrieve transactions." });
  }
};

const getTransactionsByType = async (req, res) => {
  const userId = req.user.user_id;
  const { type } = req.params; // `deposit` or `transfer`

  try {
    // Validate the transaction type
    if (!["deposit", "transfer"].includes(type)) {
      return res.status(400).json({ message: "Invalid transaction type." });
    }

    // Query transactions of a specific type
    const transactions = await findTransactionsByUserId(userId, type);

    if (!transactions.length) {
      return res.status(404).json({
        message: `No ${type} transactions found.`,
      });
    }

    res.status(200).json({
      message: `${
        type.charAt(0).toUpperCase() + type.slice(1)
      } transactions retrieved successfully.`,
      transactions,
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error.message);
    res.status(500).json({ message: "Failed to retrieve transactions." });
  }
};

module.exports = {
  sendMoneyToOtherBanks,
  getAllTransactions,
  getTransactionsByType,
};
