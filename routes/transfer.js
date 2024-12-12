const router = require("express").Router();

const { sendMoneyToOtherBanks } = require("../controllers/transfer");
const { authenticated } = require("../middlewares/authentication");

router.route("/sendmoney").post(authenticated, sendMoneyToOtherBanks);



module.exports = router;







;

