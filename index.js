import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";
import { dbConnection } from "./config/dbConnection.js";
import v1Router from "./routes/index.js";
const server = express();
const PORT = process.env.PORT || 3000;

// Middlewares
server.use(
  cors({
    origin: [
      "https://link-generator-frontend-rust.vercel.app",
      "https://link-generator-admin.vercel.app",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
server.use(express.json());
server.use(cookieParser());
server.use(passport.initialize());

server.get("/", (req, res) => {
  res.send("Server is up and running!");
});

server.use("/v1", v1Router);

// Database connection function
dbConnection()
  .then(() => {
    console.log("Database Connected...!");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
