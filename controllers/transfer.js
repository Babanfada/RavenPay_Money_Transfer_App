const axios = require("axios");
const qs = require("qs");
const db = require("../models/db");
const { BAD_REQUEST } = require("../middlewares/customErrors");
const { createTransaction } = require("../models/webhook");
const {
  findBankAccountByUserId,
  updateBankAccount,
} = require("../models/bank_account");

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
  // Perform the transfer using Raven Atlas API
  const ravenApiKey = process.env.RAVEN_ATLAS_API_KEY;
  const ravenApiUrl =
    "https://integrations.getravenbank.com/v1/transfers/create";
  try {
    const data = qs.stringify({
      amount,
      bank_code: "044",
      bank: recipient_bank,
      account_number: recipient_account,
      account_name: "Pastor Bright",
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
    console.log("heereeeee");
    const response = await axios(config);
    console.log(response.data);
    // Log the transaction
    const newTransaction = {
      user_id: userId,
      account_id: userAccount.act_id,
      type: response.data.data.narration,
      amount: response.data.data.amount,
      reference: response.data.data.trx_ref,
      status: response.data.status || "pending",
      recipient_bank: response.data.data.bank,
      recipient_account: response.data.data.account_number,
    };

    const [transactionId] = await createTransaction(newTransaction);

    // Deduct the balance from the sender's account
    await updateBankAccount(userId, { balance: userAccount.balance - amount });

    // Respond with success
    res.status(201).json({
      message: "Transfer successful.",
      transaction: { id: transactionId, ...newTransaction },
    });
  } catch (error) {
    console.error("Transfer error:", error.message);
    throw new BAD_REQUEST("Transfer failed. Please try again.");
  }
};

module.exports = { sendMoneyToOtherBanks };
