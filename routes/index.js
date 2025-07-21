import express from "express"
const router = express.Router()

import userRouter from "./userRouters.js"

router.use("/user", userRouter)

export default router