import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { clearOrder, placeOrder } from "../controllers/order.controller.js";

const router = Router();

router.use(verifyJwt);

// to add an order
router.route("/addorder").post(placeOrder)

// clear an order
router.route("/clearorder/:orderId").delete(clearOrder);

// router.route("/getorders").get(getOrders);

export default router;