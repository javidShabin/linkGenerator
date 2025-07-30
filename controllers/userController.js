import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";

// Get all users list for admin
export const getAllUsers = async (req, res, next) => {
  try {
    // Find the users from databse
    const users = await userModel.find({})
    if (!users) {
      throw new AppError("No users found", 404)
    }
    res.status(200).json({message: "Fetch all users", data: users})
  } catch (error) {
    next(error)
  }
}

// User profile updating function
export const updateUserProfile = async (req, res, next) => {
  try {
    console.log(req.file)
  } catch (error) {
    
  }
}

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
