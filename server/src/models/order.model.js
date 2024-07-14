import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    totalCost: {
      type: Number,
    },
    orderDate: String,
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
