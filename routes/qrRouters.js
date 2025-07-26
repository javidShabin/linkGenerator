import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
import { downloadQrCode, generateQrCode } from "../controllers/qrController.js"
const router = express()


router.post("/generate-qr/:slug",authenticate, authorize("user","pro"), generateQrCode)
router.get("/download/:id", authenticate, authorize("user", "pro"), downloadQrCode);


export default router