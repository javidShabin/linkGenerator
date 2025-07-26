// server/models/paymentModel.js
import mongoose from "mongoose";
const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: Number,
  currency: String,
  status: String,
  plan: {
    type: String,
    enum: ["pro-plan", "one-time"],
    required: true,
  },
}, { timestamps: true });


export default mongoose.model("Payment", paymentSchema);
