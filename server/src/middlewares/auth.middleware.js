import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export default async function verifyUser(req, res, next) {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      if(!token){
        return res.status(401).json({message:"Unauthorized token",success:false})
      }

      const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN);

      const user = await User.findById(decodedToken._id).select("-password");

      if(!user){
        return res.status(401).json({message:"Invalid access token"})
      }

      req.user = user;

      next()

  } catch (error) {
    return res.status(400).json({ message: "Invalid access" });
  }
}
