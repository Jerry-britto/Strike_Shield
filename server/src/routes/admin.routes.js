import { Router } from "express";
import { verifyJwt, verifyAdmin } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/admin.controller.js";
import { getProductDataAnalytic } from "../controllers/product.controller.js";
import { getUsers } from "../controllers/user.controller.js";

const router = Router();

router.use(verifyJwt, verifyAdmin);

router.route("/analytics").get(getAnalytics);

router.route("/productanalytics").get(getProductDataAnalytic);

router.route("/getUsers").get(getUsers);

export default router;
