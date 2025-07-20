import { userSignupValidation } from "../config/authValidations.js";
import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword } from "../utils/hashPassword.js";

export const signupUser = async (req, res, next) => {
  try {
    // Validate the user details
    userSignupValidation(req.body)
    // Destructer user details from request body
    const {userName, email, password, phone} = req.body
    // Check the user details in database
    // Find the user from database
    const isUserExist = await userModel.findOne({email})
    if (isUserExist) {
      throw new AppError("User already exist", 404)
    }
    // Hash the user password 10 round salting using bcrypt
    const hashedPassword = await hashPassword(password)
    
  } catch (error) {
    next(error)
  }
};
