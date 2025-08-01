import express from "express";
import passport from "passport";
import { generateToken } from "../utils/generateToken.js";

const router = express.Router();

// Trigger Google login
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle the callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    // ✅ Check if the user is not active
    if (!req.user.isActive) {
      return res.redirect("https://link-generator-frontend-rust.vercel.app/account-blocked");
    }

    // Generate JWT token for active users
    const token = generateToken({
      id: req.user.id,
      email: req.user.email,
      role: req.user.role,
    });

    // Set token in a secure cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Redirect to frontend dashboard
    res.redirect("https://link-generator-frontend-rust.vercel.app/");
  }
);

export default router;
