import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

/// Get all users list for admin (excluding admin users)
export const getAllUsers = async (req, res, next) => {
  try {
    // Find users where role is NOT 'admin'
    const users = await userModel.find({ role: { $ne: "admin" } });

    if (!users || users.length === 0) {
      throw new AppError("No users found", 404);
    }

    res.status(200).json({ message: "Fetched all users", users });
  } catch (error) {
    next(error);
  }
};

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

// Get pro users list
export const getProUsers = async (req, res, next) => {
  try {
    const proUsers = await userModel.find({ isPro: true });
    if (!proUsers) {
      throw new AppError("Pro users not found", 404);
    }
    res
      .status(200)
      .json({ message: "Fetch pro users profiles", data: proUsers });
  } catch (error) {
    next(error);
  }
};

// Delete user profile
export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.body;

    // Delete the user from the database
    const deletedUser = await userModel.findByIdAndDelete(userId);

    if (!deletedUser) {
      throw new AppError("User not found", 404)
      
    }

    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({ message: "User profile deleted successfully" });
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
