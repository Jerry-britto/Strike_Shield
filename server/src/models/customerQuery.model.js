import mongoose, { Schema } from "mongoose";

const customerQuerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },

  { timestamps: true }
);

export const customerQuery = mongoose.model("customerQuery", customerQuerySchema);
