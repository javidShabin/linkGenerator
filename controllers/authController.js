import { userSignupValidation } from "../config/authValidations.js";

export const signupUser = async (req, res, next) => {
  try {
    // Validate the user details
    userSignupValidation(req.body)
    // Destructer user details from request body
    const {userName, email, password, confirmPassword, phone} = req.body
    
  } catch (error) {
    next(error)
  }
};
