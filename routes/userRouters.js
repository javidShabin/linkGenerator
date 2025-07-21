import express from "express"
import { signupUser } from "../controllers/authController.js"
const router = express()

router.post("/signup", signupUser)

export default router