import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

// Check user is pro
export const isProUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(AppError("User not authorized", 401));
    }
    // Fetch full user data (excluding password)
    const user = await userModel.findById(req.user.id).select("-password");
    if (!user) {
      return next(AppError("User not pro", 404));
    }

    // If user authorized
    res.status(200).json({
      success: true,
      message: "User authorized",
      user,
    });
  } catch (error) {
    next(error);
  }
};
