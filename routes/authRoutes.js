import express from "express";
const router = express.Router();

import {
  registerUser,
  loginUser,
  logOutUser,
} from "../controllers/authController.js";

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logOutUser);

export default router;
