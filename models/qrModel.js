// models/qrCodeModel.js
import mongoose from "mongoose";
import { type } from "os";

const qrCodeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    linkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Link",
      required: true,
    },
    whatsappLink: {
      type: String,
      required: true,
    },
    qrCodeImage: {
      type: String, // base64 Data URL (or file URL if storing in cloud)
      required: true,
    },
    generatedFor: {
      type: String,
      enum: ["whatsappLink", "shortLink"],
      default: "whatsappLink",
    },
    generatedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QRCode", qrCodeSchema);
