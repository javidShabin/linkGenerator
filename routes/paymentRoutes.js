// server/routes/paymentRoutes.js
import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create-checkout-session",authenticate, authorize("user"), createCheckoutSession);

export default router;
