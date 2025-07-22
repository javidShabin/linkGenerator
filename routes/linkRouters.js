import express from "express"
import { createLink, getPrevLinks } from "../controllers/linkController.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
const router = express()

router.post("/create-link", authenticate, authorize("user"), createLink)
router.get("/get-prev-links", authenticate, authorize("user"), getPrevLinks)

export default router