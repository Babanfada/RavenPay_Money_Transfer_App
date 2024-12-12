const router = require("express").Router();

const { generateBankAccount } = require("../controllers/bankAccouts");
const { authenticated } = require("../middlewares/authentication");

router.route("/").post(authenticated, generateBankAccount);

module.exports = router;
