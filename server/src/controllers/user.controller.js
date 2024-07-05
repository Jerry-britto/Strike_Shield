import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  try {
    const { first_name, last_name, email, password, cpassword } = req.body;
    if (
      [first_name, last_name, email, password, cpassword].some(
        (ele) => ele?.trim() === ""
      )
    ) {
      return res
        .status(400)
        .json({ messsage: "All Fields are required", success: false });
    }

    if (password !== cpassword) {
      return res
        .status(400)
        .json({ message: "Your passwords are not matching", success: false });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        messsage: "User with the given email id exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      isAdmin: req.body.isAdmin === true,
    });

    const savedUser = await User.findById(user._id).select("-password");

    if (!savedUser) {
      return res.status(500).json({
        message: "Error occured while registering user",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Registered successfully",
      success: true,
      savedUser,
    });
  } catch (error) {
    console.log("error occured due to ", error.message);
  }
}

export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email are password are mandatory", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const verifyPassword = await user.isPasswordCorrect(password);

    if (!verifyPassword) {
      return res
        .status(400)
        .json({ message: "Incorrect Password", success: false });
    }

    const accessToken = await user.generateToken();

    const options = {
      httpOnly: true,
      secure: true,
    };

    const loggedInUser = await User.findById(user._id).select(
      "-carts -password"
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({
        message: `Logged In ${!loggedInUser.isAdmin ? "User" : "Admin"}`,
        loggedInUser,
        success: true,
      });
  } catch (error) {
    console.log(`Error occured due to ${error.message}`);
  }
}

export async function logoutUser(req, res) {
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json({ message: `User ${req.user.email} logged out`, success: true });
}

export async function validUser(req, res) {
  const user = await User.findById(req.user?._id).select("-password -carts");

  if (!user) {
    return res
      .status(400)
      .json({ message: "User not logged in", success: false });
  }

  return res
    .status(200)
    .json({
      message: `Valid Logged in ${user.isAdmin ? "Admin" : "User"}`,
      user,
    });
}

// add to cart

// remove to cart

// get all cart items


