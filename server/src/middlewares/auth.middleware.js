import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJwt = async (req, res, next) => {
  try {
    //if request is sent through mobile there is a high chance that there are no cookies sent so we hancle the case for that as well
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", ""); //header: Bearer <tokens>
    // console.log("token ", token);

    if (!token) {
      throw new Error("Unauthorized token");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      console.log("user not found");
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    req.user = user; //making user available in the request object

    next();
  } catch (error) {
    console.log("Something went wrong while auth ", error.message);
    return res.status(401).json({ message: error.message });
  }
};
