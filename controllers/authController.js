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
      secure: false,
      sameSite: "strict",
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
    // Compare the password
    const passwordIsMatch = await comparePassword(password, isUser.password);
    if (!passwordIsMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    // Generate the user token by JWT using id , email and role
    const token = generateToken({
      id: isUser.id,
      email: isUser.email,
      role: isUser.role,
    });
    res.cookie("userToken", token, {
      // Store the token in cookie
      httpOnly: true,
      secure: false,
      sameSite: "strict",
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
    const user = await userModel.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404)
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};


// Check user
export const checkUser = async (req, res, next) => {
  try {
    // Get user from req.user
    const user = req.user;
    // Check user authorizes or not
    if (!user) {
      throw new AppError("User not authorised", 400);
    }
    // If user authorized
    res.json({ success: true, message: "user autherised" });
  } catch (error) {
    res.status(401).json(error);
  }
};
