// models/qrCodeModel.js
import mongoose from "mongoose";

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
    qrCodeImage: {
      type: String, // base64 Data URL (or file URL if storing in cloud)
      required: true,
    },
    generatedFor: {
      type: String,
      enum: ["whatsappLink", "shortLink"],
      default: "whatsappLink",
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("QRCode", qrCodeSchema);
