const jwt = require("jsonwebtoken");
const createUser = (user) => {
  return {
    user_id: user.user_id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
  };
};

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};
const verifyToken = (token) => {
  const isValid = jwt.verify(token, process.env.JWT_SECRET);
  return isValid;
};

const attachResponseToCookie = ({ res, tokenUser, refreshToken }) => {
  const accessTokenJWT = createToken({ tokenUser });
  const refreshTokenJWT = createToken({ tokenUser, refreshToken });
  const oneDay = 1000 * 60 * 60 * 24;
  const twoWeeks = 1000 * 60 * 60 * 24 * 14;
  // console.log(accessTokenJWT,refreshTokenJWT)
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    signed: true,
    secure: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + twoWeeks),
    sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    signed: true,
    secure: true,
  });
};

module.exports = {
  verifyToken,
  createToken,
  createUser,
  attachResponseToCookie,
};
