const router = require("express").Router();

const { handleWebhook } = require("../controllers/webhook");
const { authenticated } = require("../middlewares/authentication");

router.route("/notification").post(authenticated, handleWebhook);

module.exports = router;
