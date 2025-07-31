// server/routes/paymentRoutes.js
import express from "express";
import {
  createCheckoutSession,
  getAllPaymentDetails,
  getStripeSessionDetails,
} from "../controllers/paymentController.js";
import { authorize } from "../middlewares/authorize.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/create-checkout-session",
  authenticate,
  authorize("user", "pro"),
  createCheckoutSession
);
router.get(
  "/session/:sessionId",
  authenticate,
  authorize("user", "pro"),
  getStripeSessionDetails
);

router.get(
  "/get-payments",
  authenticate,
  authorize("admin"),
  getAllPaymentDetails
);
export default router;
