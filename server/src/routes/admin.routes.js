import { Router } from "express";
import { verifyJwt, verifyAdmin } from "../middlewares/auth.middleware.js";
import { getAnalytics } from "../controllers/admin.controller.js";
import { getProductDataAnalytic } from "../controllers/product.controller.js";

const router = Router();

router.use(verifyJwt, verifyAdmin);

router.route("/analytics").get(getAnalytics);

router.route("/productanalytics").get(getProductDataAnalytic);

export default router;
