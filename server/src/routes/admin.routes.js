import { Router } from "express";
import { verifyJwt,verifyAdmin } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/admin.controller.js";

const router = Router();

router.use(verifyJwt,verifyAdmin);

router.route("/analytics").get(getAnalytics);


export default router;