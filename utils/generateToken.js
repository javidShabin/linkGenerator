import dotenv from "dotenv";
dotenv.config(); 
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_EXPIRES_IN = "7d";

export const generateToken = ({ id, email, role }) => {
  return jwt.sign({ id, email, role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
