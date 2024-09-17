import { Router } from "express";
import {
  getTokens,
  loginUser,
  logoutUser,
  registerUser,
  validUser,
} from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJwt,logoutUser);

router.route("/validuser").get(verifyJwt,validUser);

router.route("/gettokens").post(verifyJwt,getTokens);

export default router;
