import mongoose, { Schema } from "mongoose";

const OrderDetailSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

export const OrderDetail = mongoose.model("OrderDetail", OrderDetailSchema);
