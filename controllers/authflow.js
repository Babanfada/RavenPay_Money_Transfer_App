const { StatusCodes } = require("http-status-codes");
const db = require("../models/db");
const crypto = require("crypto");
const {
  FORBIDDEN,
  UNAUTHORIZED,
  NOT_FOUND,
  BAD_REQUEST,
} = require("../middlewares/customErrors");
const {
  findUserByEmail,
  createUserObject,
  updateUserByEmail,
  comparePassword,
} = require("../models/usersModel");
const {
  findTokenByUserId,
  createToken,
  deleteToken,
} = require("../models/token");
const { createUser, attachResponseToCookie } = require("../utils/jwt");
const register = async (req, res) => {
  const { name, email, password, phone, gender } = req.body;
  // console.log(req.body);
  if (!name || !email || !password || !phone || !gender) {
    throw new BAD_REQUEST("pls provide the neccesary fields");
  }
  const isEmailAlreadyExist = await findUserByEmail(email);
  if (isEmailAlreadyExist) {
    throw new BAD_REQUEST("This Email has already been registered");
  }
  const verificationString = crypto.randomBytes(40).toString("hex");
  const userObject = {
    name,
    email,
    password,
    phone,
    gender,
    verificationString,
  };
  const user = await createUserObject(userObject);
  res.status(StatusCodes.CREATED).json({
    msg: "Please use the sting to verify your mail and complete registeration",
    verificationString,
  });
};

const verifyMail = async (req, res) => {
  const { verificationString, email } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new BAD_REQUEST(
      "verification failed!!!, this email is not registered yet"
    );
  }
  // console.log("here");
  if (verificationString !== user.verificationString) {
    throw new BAD_REQUEST("verification failed!!!");
  }

  // Update user
  const updates = {
    verificationString: null,
    isVerified: true,
    verified: new Date(),
  };
  const updatedUser = await updateUserByEmail(email, updates);
  if (!updatedUser) {
    throw new NOT_FOUND("Failed to update user details during verification.");
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Congratulations!!!! Email now verified" });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BAD_REQUEST(
      "You have not provided either an email or a password"
    );
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new BAD_REQUEST("This email has not been registered yet !!!");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  //   console.log(isPasswordCorrect);

  if (!isPasswordCorrect) {
    throw new UNAUTHORIZED("invalid credentials");
  }
  const isVerified = user.isVerified;
  //   const isVerified = false;
  if (!isVerified) {
    throw new UNAUTHORIZED(
      "This Email is not verified yet, please verify your email first !!!"
    );
  }
  const tokenUser = createUser(user);
  //   create a refresh token
  let refreshToken = "";
  //   if user session is still valid
  const isTokenStillVaild = await findTokenByUserId(user.user_id);
  if (isTokenStillVaild) {
    const isValid = isTokenStillVaild.isValid;
    if (!isValid) {
      throw new UNAUTHORIZED("Token is not valid");
    }
    refreshToken = isTokenStillVaild.refreshToken;
    attachResponseToCookie({ res, refreshToken, tokenUser });
    res.status(StatusCodes.OK).json({ msg: "Login Sucessful !!!!" });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await createToken({ refreshToken, userAgent, ip, user: user.user_id });
  attachResponseToCookie({ res, refreshToken, tokenUser });
  res.status(StatusCodes.OK).json({ msg: "Login Sucessful !!!!" });
};
const showMe = async (req, res) => {
  const { user_id, name, email } = req.user;
  res.status(StatusCodes.OK).json({
    user_id,
    name,
    email,
  });
};
const logout = async (req, res) => {
  await deleteToken({ user: req.user.user_id });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
module.exports = { register, verifyMail, login, showMe, logout };
