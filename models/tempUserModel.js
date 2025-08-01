import mongoose from "mongoose";

const tempUserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    otp: { type: String, required: true },
    otpExpiresAt: { type: Date, required: true },
    isPro: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    profileImg: {
      type: String,
      default:
        "//ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128",
    },
    role: {
      type: String,
      enum: ["user", "admin", "pro"],
      default: "user",
    },
    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("TempUser", tempUserSchema);
