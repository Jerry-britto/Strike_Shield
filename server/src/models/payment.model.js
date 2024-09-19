import mongoose, { Schema } from "mongoose";

const PaymentSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    userId:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    paymentDate: {
      type: String,
    },
    paymentAmount: {
      type: Number,
    },
    discount:{
      type:Boolean,
      default:false
    },
    deliveryCharge:{
      type:Boolean,
      default:false
    },
    receipt:Object,
    status:{
      type:String,
      enum:["SUCCESS","PENDING"],
      default:"PENDING"
    }
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", PaymentSchema);
