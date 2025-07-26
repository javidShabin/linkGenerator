import express from "express"
const router = express.Router()

import userRouter from "./userRouters.js"
import linkRouter from "./linkRouters.js"
import paymentRoutes from './paymentRoutes.js';
import qrRouter from "./qrRouters.js"

router.use("/user", userRouter)
router.use("/link", linkRouter)
router.use("/qr", qrRouter)
router.use('/payment', paymentRoutes);

export default router


