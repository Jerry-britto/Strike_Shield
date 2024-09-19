import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { clearOrder, placeOrder } from "../controllers/order.controller.js";
import { getPayment, getPendingPayments, makePayment } from "../controllers/payment.controller.js";

const router = Router();

router.use(verifyJwt);

// to add an order
router.route("/addorder").post(placeOrder);

// clear an order
router.route("/clearorder/:orderId").delete(clearOrder);

// make payment
router.route("/payment/:paymentId").post(makePayment);

// get payments
router.route("/payment").get(getPayment);

// get pending orders
router.route("/pending").get(getPendingPayments);

export default router;
