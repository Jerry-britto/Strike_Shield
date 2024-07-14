import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: [true, "Kindly provide your first name"],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, "Kindly provide you last name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Kindly provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Kindly Provide your password"],
      min: [6, "Password too short"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  return token;
};


export const User = mongoose.model("User", userSchema);
