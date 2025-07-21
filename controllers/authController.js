import { userSignupValidation } from "../config/authValidations.js";
import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { hashPassword } from "../utils/hashPassword.js";

export const signupUser = async (req, res, next) => {
  try {
    // Validate the user details
    userSignupValidation(req.body)
    // Destructer user details from request body
    const {userName, email, password, phone, role} = req.body
    // Check the user details in database
    // Find the user from database
    const isUserExist = await userModel.findOne({email})
    if (isUserExist) {
      throw new AppError("User already exist", 404)
    }
    // Hash the user password 10 round salting using bcrypt
    const hashedPassword = await hashPassword(password)
    
    // Create new user
    const newUser = new userModel({
      userName,
      email,
      password: hashedPassword,
      phone,
      role
    })
    await newUser.save()
    //Token creation
    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    next(error)
  }
};
