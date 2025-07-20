import { userSignupValidation } from "../config/authValidations.js";

export const signupUser = async (req, res, next) => {
  try {
    // Validate the user details
    userSignupValidation(req.body)
  } catch (error) {
    next(error)
  }
};
