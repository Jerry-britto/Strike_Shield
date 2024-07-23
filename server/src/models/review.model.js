import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type:String,
      required:true
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
