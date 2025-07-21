import express from "express"
import { createLink } from "../controllers/linkController.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
const router = express()

router.post("/create-link", authenticate, authorize("user"), createLink)

export default router