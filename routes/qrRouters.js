import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
import { downloadQrCode, editQrCode, generateQrCode } from "../controllers/qrController.js"
import upload from "../middlewares/upload.js"
const router = express()


router.post("/generate-qr/:slug",authenticate, authorize("user","pro"), generateQrCode)
router.get("/download/:id", authenticate, authorize("user", "pro"), downloadQrCode);
router.patch("/edit-qr/:id", authenticate, authorize("user", "pro"),upload.single("logo"), editQrCode)


export default router