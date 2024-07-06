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
    carts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    tokens: [
      {
        token: {
          type: String,
        },
      },
    ],
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
  this.tokens = this.tokens.concat({ token: token });
  await this.save();
  return token;
};

userSchema.methods.addToCart = async function (cartItem) {
  try {
    this.carts = this.carts.concat(cartItem);
    await this.save();
    return this.carts;
  } catch (error) {
    console.log("Could not add to cart due to " + error.message);
  }
};

export const User = mongoose.model("User", userSchema);
