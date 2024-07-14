import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    paymentDate: {
      type: String,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
