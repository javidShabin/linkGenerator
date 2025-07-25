import express from "express";
import {
  checkUser,
  loginUser,
  signupUser,
  userProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";
const router = express();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/user-profile", authenticate, authorize("user"), userProfile)
router.get("/check-user", authenticate, authorize("user"), checkUser);

export default router;
