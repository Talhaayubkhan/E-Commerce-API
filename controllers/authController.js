import User from "../models/UserModel.js";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse, createTokenUser } from "../utils/index.js";
import {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} from "../errors/index.js";
const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAlreadyExist = await User.findOne({ email });
  if (emailAlreadyExist) {
    throw new BadRequestError("Email already exists");
  }

  // first user register as admin
  const isFirstAccount = (await User.countDocuments()) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.CREATED).json({
    user: tokenUser,
    success: true,
  });
};
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isMatchPassword = await user.comparePassword(password);
  if (!isMatchPassword) {
    throw new BadRequestError("Incorrect Password");
  }

  const tokenUser = {
    name: user.name,
    userId: user._id,
    role: user.role,
  };

  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser, success: true });
};
const logOutUser = (req, res) => {
  res.cookie("token", "logout", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

export { registerUser, loginUser, logOutUser };
