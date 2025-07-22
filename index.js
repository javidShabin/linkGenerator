import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbConnection } from "./config/dbConnection.js";
import v1Router from "./routes/index.js";
const server = express();
const PORT = 3000;

// Middlewares
server.use(
  cors({
    origin: true,
    credentials: true,
  })
);
server.use(express.json());
server.use(cookieParser());

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
