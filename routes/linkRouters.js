import express from "express"
import { createLink, getPrevLinks, trachLinkUsage } from "../controllers/linkController.js"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
const router = express()

router.post("/create-link", authenticate, authorize("user"), createLink)
router.get("/get-prev-links", authenticate, authorize("user"), getPrevLinks)
router.get("/track-link/:slug", trachLinkUsage)

export default router