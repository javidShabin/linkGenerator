import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Get token from Bearer header or cookie
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies?.userToken;

  if (!token) {
    console.log("error");
    return res
      .status(401)
      .json({ message: "Authentication token missing or invalid" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Set user info to request object
    next();
  } catch (error) {
    console.log(error); // ← Use the correct variable name
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
