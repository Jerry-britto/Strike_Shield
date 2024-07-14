import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true,"Name is requried"],
    },
    views:{
        type:Number,
        default:0
    },
    description: {
      shortDescription: {
        type: String,
        required: [true,"Short description is required"],
      },
      longDescription: {
        type: String,
        required: [true,"Long description is required"],
      },
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price is mandatory"],
    },
    category: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coverImage: {
      type: String,
      required: [true, "cover image is required"],
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
