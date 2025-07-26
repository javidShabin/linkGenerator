import express from "express";
import {
  checkUser,
  loginUser,
  logoutUser,
  signupUser,
  userProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";
import { isProUser } from "../controllers/userController.js";
const router = express();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.delete("/logout", authenticate, authorize("user"), logoutUser);
router.get("/user-profile", authenticate, authorize("user"), userProfile);
router.get("/check-user", authenticate, authorize("user"), checkUser);
router.get("/check-pro",  authenticate, authorize("pro"), isProUser)

export default router;
