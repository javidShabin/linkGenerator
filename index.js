import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
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

server.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
