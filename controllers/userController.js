import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

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

// update user profile
export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userName, email, phone } = req.body;

    // Prepare the data to update
    const updateData = { userName, email, phone };

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      throw new AppError("No user found", 404);
    }

    // Upload profile image if file is provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (!uploadResult.success) {
        return res.status(500).json({
          success: false,
          message: uploadResult.message,
          error: uploadResult.error,
        });
      }
      updateData.profileImg = uploadResult.url;
    }

    // Update user with new data
    await userModel.findByIdAndUpdate(userId, updateData, { new: true });

    res.status(200).json({ success: true, message: "Profile updated" });

  } catch (error) {
    next(error);
  }
};


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
