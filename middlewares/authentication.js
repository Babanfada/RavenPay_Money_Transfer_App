const { verifyToken, attachResponseToCookie } = require("../utils/jwt");
const { findToken } = require("../models/token");
const { UNAUTHORIZED } = require("../middlewares/customErrors");

const authenticated = async (req, res, next) => {
  const { accessToken, refreshToken: refreshedToken } = req.signedCookies;
  try {
    if (accessToken) {
      const { tokenUser } = verifyToken(accessToken);
      // console.log(tokenUser);
      req.user = tokenUser;
      return next();
    }

    const { tokenUser, refreshToken } = verifyToken(refreshedToken);
    // console.log(tokenUser, refreshToken);

    const existingToken = await findToken({
      user_id,
      refreshToken,
    });

    const isValidToken = existingToken?.isValid;
    if (!isValidToken || !existingToken) {
      throw new UNAUTHORIZED("Token is not valid");
    }
    req.user = tokenUser;
    attachResponseToCookie({ tokenUser, res, refreshToken });
    next();
  } catch (err) {
    throw new UNAUTHORIZED("Authentication invalid, there is no token");
  }
};

module.exports = {
  authenticated,
};
