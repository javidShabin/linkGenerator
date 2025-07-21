import express from "express"
const router = express.Router()

import userRouter from "./userRouters.js"
import linkRouter from "./linkRouters.js"

router.use("/user", userRouter)
router.use("/link", linkRouter)

export default router