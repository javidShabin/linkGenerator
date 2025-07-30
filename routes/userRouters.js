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
import { getAllUsers, isProUser, updateUserProfile } from "../controllers/userController.js";
import upload from "../middlewares/upload.js";
const router = express();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.delete("/logout", authenticate, authorize("user", "pro"), logoutUser);
router.get("/user-profile", authenticate, authorize("user", "pro"), userProfile);
router.get("/get-all-users", authenticate, authorize("user", "pro"), getAllUsers)
router.put("/update-profile", authenticate, authorize("user", "pro"), upload.single("profileImg"), updateUserProfile)
router.get("/check-user", authenticate, authorize("user", "pro"), checkUser);
router.get("/check-pro",  authenticate, authorize("user","pro"), isProUser)

export default router;
