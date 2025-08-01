import express from "express";
import {
  checkUser,
  generateOTP,
  loginUser,
  logoutUser,
  verifyOtp,
  toggleUserActiveStatus,
  userProfile,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.js";
import {
  deleteUser,
  getAllUsers,
  getProUsers,
  getProUsersCount,
  getUsersCount,
  isProUser,
  updateUserProfile,
} from "../controllers/userController.js";
import { upload } from "../middlewares/upload.js";

const router = express();

router.post("/generate-otp", generateOTP)

router.post("/signup", verifyOtp);

router.post("/login", loginUser);

router.delete(
  "/logout",
  authenticate,
  authorize("user", "pro", "admin"),
  logoutUser
);

router.get(
  "/user-profile",
  authenticate,
  authorize("user", "pro", "admin"),
  userProfile
);

router.get("/get-all-users", authenticate, authorize("admin"), getAllUsers);

router.get("/pro-users-list", authenticate, authorize("admin"), getProUsers);

router.get("/get-user-count", authenticate, authorize("admin"), getUsersCount);

router.get(
  "/get-pro-user-count",
  authenticate,
  authorize("admin"),
  getProUsersCount
);

router.put(
  "/update-profile",
  authenticate,
  authorize("user", "pro", "admin"),
  upload.single("profileImg"),
  updateUserProfile
);

router.patch(
  "/toggle-status/:userId",
  authenticate,
  authorize("admin"),
  toggleUserActiveStatus
);

router.get(
  "/check-user",
  authenticate,
  authorize("user", "pro", "admin"),
  checkUser
);

router.delete(
  "/delete-user-profile/:userId",
  authenticate,
  authorize("admin"),
  deleteUser
);

router.get("/check-pro", authenticate, authorize("user", "pro"), isProUser);

export default router;
