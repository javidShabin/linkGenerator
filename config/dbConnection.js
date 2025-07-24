import mongoose from "mongoose";
export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
  } catch (error) {
    console.error("Database connection error:", error.message);
  }
};
