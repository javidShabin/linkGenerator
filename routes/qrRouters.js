import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
import { downloadQrCode, generateQrCode } from "../controllers/qrController.js"
const router = express()


router.post("/generate-qr/:slug",authenticate, authorize("user"), generateQrCode)
router.get("/download/:id", authenticate, authorize("user"), downloadQrCode);


export default router