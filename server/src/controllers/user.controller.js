import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export async function registerUser(req, res) {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      cpassword,
      address,
      mobile,
    } = req.body;
    if (
      [first_name, last_name, email, password, cpassword, address, mobile].some(
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
      tokens: !req.body.isAdmin ? 10000 : 0,
      mobile,
    });

    const savedUser = await User.findById(user._id).select(
      "-password -isAdmin"
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
    return res.status(500).json({ message: error.message });
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
      secure: true,
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    if (!loggedInUser) {
      console.log("logged in user not retrieved");
      return res.status(500).json({ message: "Log in failed", success: true });
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
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
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .clearCookie("accessToken", options)
      .status(201)
      .json({
        message: `${req.user?.isAdmin ? "Admin" : "User"} ${
          req.user?.email
        } logged out`,
        success: true,
      });
  } catch (error) {
    console.log("Logout fail due to " + error.message);
  }
}

export async function validUser(req, res) {
  try {
    return res.status(200).json({
      message: `Valid Logged in ${req.user?.isAdmin ? "Admin" : "User"}`,
      user: req.user,
    });
  } catch (error) {
    console.log("error occured while finding user", error.message);
  }
}

export async function getUsers(_, res) {
  try {
    const users = await User.find({ isAdmin: false })
      .select("-password -address -isAdmin -mobile -carts -updatedAt")
      .sort({ createdAt: -1 });

    return res.status(200).send(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "could not retrieve users",
      reason: error.message,
      success: false,
    });
  }
}

export async function getTokens(req, res) {
  try {
    const { email = "", password = "" } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User does not exist");
      return res.status(404).json({ message: "User not found" });
    }

    if (user.purchaseStamp) {
      const currentTime = new Date();
      if (currentTime < user.purchaseStamp) {
        console.log("not eligible for tokens");
        return res
          .status(403)
          .json({ message: "Token grant limit not reached" });
      }
    }

    if (!email || !password) {
      return res.status(400).json({
        message: "Kindly provide your credentials",
        success: false,
      }); 
    }

    // Grant tokens logic here
    if (email != user.email) {
      return res.status(400).json({
        message: "Incorrect Email",
        success: false,
      });
    }

    const checkPassword = await user.isPasswordCorrect(password);
    if (!checkPassword) {
      return res.status(400).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    console.log("Granting tokens");

    user.tokens += 5000;
    const serverTime = new Date();

    serverTime.setHours(serverTime.getHours() + 120);
    user.purchaseStamp = serverTime;

    await user.save();

    return res.status(200).json({ message: "Tokens granted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
}
