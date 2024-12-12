const db = require("../models/db");
const { BAD_REQUEST } = require("../middlewares/customErrors");
const { findTransaction, createTransaction } = require("../models/webhook");

const handleWebhook = async (req, res) => {
  try {
    const { user_id, account_id, type, amount, reference, status } = req.body;

    // Validate required fields
    if (!user_id || !account_id || !type || !amount || !reference || !status) {
      throw new BAD_REQUEST("Missing required fields in webhook payload.");
    }

    const existingTransaction = await findTransaction(reference);

    if (existingTransaction) {
      return res.status(409).json({ message: "Transaction already exists." });
    }

    
    await createTransaction({
      user_id,
      account_id,
      type,
      amount,
      reference,
      status,
    });
    // Respond with a success message
    res.status(201).json({ message: "Webhook processed successfully." });
  } catch (error) {
    console.error("Error handling webhook:", error.message);
    res.status(400).json({ error: error.message });
  }
};

module.exports = { handleWebhook };
