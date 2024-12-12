const router = require("express").Router();

const {
  register,
  verifyMail,
  login,
  showMe,
  logout,
} = require("../controllers/authflow");

const { authenticated } = require("../middlewares/authentication");

router.route("/register").post(register);
router.route("/verify-email").post(verifyMail);
router.route("/login").post(login);
router.route("/logout").delete(authenticated, logout);
router.route("/showme").get(authenticated, showMe);

module.exports = router;
