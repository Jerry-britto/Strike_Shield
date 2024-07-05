import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  validUser,
} from "../controllers/user.controller.js";
import verifyUser from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyUser, logoutUser);

router.route("/validuser").get(verifyUser, validUser);

export default router;
