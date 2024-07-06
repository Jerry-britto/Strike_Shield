import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export async function registerUser(req, res) {
  try {
    const { first_name, last_name, email, password, cpassword, address } =
      req.body;
    if (
      [first_name, last_name, email, password, cpassword, address].some(
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
      address,
    });

    const savedUser = await User.findById(user._id).select(
      "-password -carts -isAdmin"
    );

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
      console.log("details not received");
      return res
        .status(400)
        .json({ message: "Email are password are mandatory", success: false });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("user does not exist");
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const verifyPassword = await user.isPasswordCorrect(password);

    if (!verifyPassword) {
      console.log("Password is incorrect");
      return res
        .status(400)
        .json({ message: "Incorrect Password", success: false });
    }

    const accessToken = await user.generateToken();

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    if (!loggedInUser) {
      console.log("logged in user not retrieved");
      return res.status(500).json({ message: "Log in failed", success: true });
    }

    return res
      .status(200)
      // .cookie("accessToken", accessToken, options)
      .json({
        message: `Logged In ${!loggedInUser.isAdmin ? "User" : "Admin"}`,
        user: loggedInUser,
        success: true,
      });
  } catch (error) {
    console.log(`Error occured due to ${error.message}`);
  }
}

export async function logoutUser(req, res) {
  try {
    console.log("request body ",req.body);

    const token = req.body.token;

    if (!token) {
      console.log("not receiving token ", token);
      return res
        .status(401)
        .json({ message: "Unauthorized token", success: false });
    }

    console.log("token: ", token);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    user.tokens = user.tokens.filter((currElem) => {
      return currElem.token !== token;
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    // res.clearCookie("accessToken", options);

    await user.save();

    return res
      .status(201)
      .json({ message: `User ${user.email} logged out`, success: true });
  } catch (error) {
    console.log("Logout fail due to " + error.message);
  }
}

export async function validUser(req, res) {
  try {
    const token = req.body.token;

    if (!token) {
      console.log("not receiving token ", token);
      return res
        .status(401)
        .json({ message: "Unauthorized token", success: false });
    }

    console.log("token: ", token);
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid access token" });
    }

    return res.status(200).json({
      message: `Valid Logged in ${user.isAdmin ? "Admin" : "User"}`,
      user,
    });
  } catch (error) {
    console.log("error occured while finding user", error.message);
  }
}

// add to cart

// remove to cart

// get all cart items
