// ************ Auth validations *****************

import { AppError } from "../utils/AppError.js";

// User signup validation
export const userSignupValidation = (data) => {
  // Destructer user details from the data
  const { userName, email, password, confirmPassword, phone } = data;
  // Check the required fileds are present or not
  if (!userName || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
  }

  // Compare the password and confirmPassword
  if (password !== confirmPassword) {
    throw new AppError("Password and confirm password do not match", 400);
  }
};

// User loign validation
export const userLoginValidation = (data) => {
  // Destructer user email and password from data
  const { email, password } = data;
  if (!email || !password) {
    throw new AppError("Email and password is required", 400);
  }
};
