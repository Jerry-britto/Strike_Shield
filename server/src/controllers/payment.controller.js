import mongoose from "mongoose";
import { Payment } from "../models/payment.model.js";
import { OrderDetail } from "../models/orderDetails.model.js";

export async function makePayment(req, res) {
  try {
    const { paymentId } = req.params;

    if (!paymentId || !mongoose.isValidObjectId(paymentId))
      return res.status(400).json({ message: "id not found", success: false });

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res
        .status(404)
        .json({ message: "Order not placed for the payment" });
    }

    const userTokens = req.user.tokens;

    if (userTokens < payment.paymentAmount) {
      return res
        .status(400)
        .json({ message: "Do not have enough tokens", success: false });
    }

    payment.status = 'SUCCESS'

    await payment.save();

    const orderData = await OrderDetail.find({orderId:payment.orderId})

    req.user.tokens -= payment.paymentAmount;

    await req.user.save();

    
  } catch (error) {
    return res.json({ message: "could not make payment", success: false });
  }
}
