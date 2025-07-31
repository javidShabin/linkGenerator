import {
  userLoginValidation,
  userSignupValidation,
} from "../config/authValidations.js";
import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";

// **************************** Authentication**************************************
//  *************************Singup and Login *************************************

// User singup
export const signupUser = async (req, res, next) => {
  try {
    // Validate the user details
    userSignupValidation(req.body);
    // Destructer user details from request body
    const { userName, email, password, phone, role } = req.body;
    // Check the user details in database
    // Find the user from database
    const isUserExist = await userModel.findOne({ email });
    if (isUserExist) {
      throw new AppError("User already exist", 404);
    }
    // Hash the user password 10 round salting using bcrypt
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new userModel({
      userName,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    // Save the new user
    await newUser.save();

    // Generate the user token by JWT using id , email and role
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    res.cookie("userToken", token, {
      // Store the token in cookie
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Send the response to client
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser
    });
  } catch (error) {
    next(error);
  }
};

// User login
export const loginUser = async (req, res, next) => {
  try {
    // Validate the user email and password
    userLoginValidation(req.body);
    // Destructer email and password from request body
    const { email, password } = req.body;
    // Check the user is singuped using the email
    const isUser = await userModel.findOne({ email });
    // User not signuped throw error
    if (!isUser) {
      throw new AppError(
        "No account found with this email. Please sign up first.",
        404
      );
    }
    if (isUser.isActive !== true) {
      throw new AppError("Your account has been deactivated by the admin.", 403)
    }
    // Compare the password
    const passwordIsMatch = await comparePassword(password, isUser.password);
    if (!passwordIsMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    isUser.lastLogin = new Date();
    await isUser.save();
    // Generate the user token by JWT using id , email and role
    const token = generateToken({
      id: isUser.id,
      email: isUser.email,
      role: isUser.role,
    });
    res.cookie("userToken", token, {
      // Store the token in cookie
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Send the response to client
    res.status(201).json({
      success: true,
      message: "User loggined successfully",
      user: isUser
    });
  } catch (error) {
    next(error);
  }
};
// Get user profile by user id
export const userProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user by ID
    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      throw new AppError("User not found", 404)
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

// User logout
export const logoutUser = async (req, res, next) => {
  try {
    // Clear the userToken cookie
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Send a success response
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Toggle user's active status (activate/deactivate)
export const toggleUserActiveStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Toggle isActive status
    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User has been ${user.isActive ? "activated" : "deactivated"} successfully`,
      userId: user._id,
      isActive: user.isActive,
    });
  } catch (error) {
    next(error);
  }
};


// Check user
export const checkUser = async (req, res, next) => {
  try {
    // Check if req.user exists (set by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Fetch full user data (excluding password)
    const user = await userModel.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If user authorized
    res.status(200).json({
      success: true,
      message: "User authorized",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

