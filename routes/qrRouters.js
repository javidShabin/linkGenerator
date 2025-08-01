import express from "express"
import { authenticate } from "../middlewares/auth.middleware.js"
import { authorize } from "../middlewares/authorize.js"
import { downloadQrCode, editQrCode, generateQrCode, getQRsCount } from "../controllers/qrController.js"
import { upload } from "../middlewares/upload.js"
const router = express()


router.post("/generate-qr/:slug",authenticate, authorize("user","pro"), generateQrCode)
router.get("/download/:id", authenticate, authorize("user", "pro"), downloadQrCode);
router.patch("/edit-qr/:id", authenticate, authorize("user", "pro"),upload.single("logo"), editQrCode)
router.get("/get-qr-counts", authenticate, authorize("admin"), getQRsCount)


export default router