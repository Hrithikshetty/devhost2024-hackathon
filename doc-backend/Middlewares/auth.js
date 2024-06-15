import { ApiError } from "../Utils/ApiError.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../Models/User.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.header("Authorization")?.replace("Bearer", "") || "").trim();

    console.log("here at middleware");
    console.log(token);

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    console.log("middleware ended");
    next();
  } catch (error) {
    console.error("Error in verifyJWT middleware:", error);

    if (error.name === 'JsonWebTokenError') {
      throw new ApiError(401, "Invalid access token");
    } else if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, "Access token has expired");
    } else {
      throw new ApiError(401, "Invalid access token");
    }
  }
});
