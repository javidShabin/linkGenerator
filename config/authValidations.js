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
};
