const axios = require("axios");
const db = require("../models/db");
const qs = require("qs");
const { BAD_REQUEST } = require("../middlewares/customErrors");
const {
  findBankAccountByUserId,
  createBankAccount,
} = require("../models/bank_account");
const generateBankAccount = async (req, res) => {
  const userId = req.user.user_id;

  // Check if user already has a bank account
  const existingAccount = await findBankAccountByUserId({ user_id: userId });

  if (existingAccount) {
    throw new BAD_REQUEST("You already have a bank account.");
  }

  // Generate a unique account number using Raven Atlas API
  const { first_name, last_name, phone, email } = req.body;
  const ravenApiKey = process.env.RAVEN_ATLAS_API_KEY;
  const ravenApiUrl =
    "https://integrations.getravenbank.com/v1/pwbt/generate_account";

  let newAccount;
  try {
    // Prepare request data
    const data = qs.stringify({
      first_name,
      last_name,
      phone,
      email,
      amount: "100",
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

    // Make the API request
    const response = await axios(config);
    // console.log(response.data, "here");
    newAccount = {
      user_id: userId,
      account_number: response.data.data.account_number,
      account_name: response.data.data.account_name,
      bank: response.data.data.bank,
      amount: response.data.data.amount,
      is_permanent: response.data.is_permanent,
      balance: 0.0,
    };
  } catch (error) {
    console.error("Error generating account number:", error.message);
    throw new BAD_REQUEST(
      "Failed to generate account number. Please try again."
    );
  }

  // Create a new bank

  await createBankAccount(newAccount);

  // Respond with the created account details
  res.status(201).json({
    msg: "Bank account created successfully.",
  });
};

module.exports = { generateBankAccount };
