import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  validUser,
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/validuser").get(validUser);

export default router;
