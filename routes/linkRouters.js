import express from "express"
import { createLink } from "../controllers/linkController.js"
const router = express()

router.post("/create-link", createLink)

export default router