import dotenv from "dotenv";
dotenv.config();
import userModel from "../models/userModel.js";
import stripe from "../utils/stripe.js";
import paymentModel from "../models/paymentModel.js";
import { AppError } from "../utils/AppError.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const email = req.user.email;

    const user = await userModel.findOne({ email });

    if (!user) throw new AppError("User not found", 404);

    if (user.isPro) {
      throw new AppError("You are already a Pro user", 400);
    }
    // Determine plan price
    let amount = 0;
    if (plan === "pro-plan") amount = 19900; // ₹199/year
    else if (plan === "one-time") amount = 49900; // ₹499/lifetime
    else return res.status(400).json({ error: "Invalid plan selected" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `WhatsApp Tool - ${
                plan === "pro-plan" ? "Pro Plan" : "One-Time Plan"
              }`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        plan,
      },
      success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/user/payment-cancel`,
    });

    await paymentModel.create({
      userId: user._id,
      sessionId: session.id,
      amount: amount / 100,
      currency: "INR",
      status: "pending",
      plan,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
    res.status(400).json({ error: err.message });
  }
};

export const getStripeSessionDetails = async (req, res, next) => {
  try {
    // Fetch session from Stripe using sessionId from URL
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );

    // Validate session first
    if (!session || session.payment_status !== "paid") {
      throw new AppError("Invalid or unpaid session.", 400);
    }

    // Extract metadata
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    // 1. Update payment record
    const existingPayment = await paymentModel.findOneAndUpdate(
      { sessionId: session.id },
      { status: true }, // mark payment as successful
      { new: true }
    );

    // 2. Update user isPro status
    if (userId) {
      await userModel.findByIdAndUpdate(userId, { isPro: true, role: "pro" });
    }

    // 3. Respond with payment details
    res.status(200).json({
      amount: session.amount_total / 100,
      currency: session.currency,
      status: session.payment_status,
      plan: plan,
      paymentUpdated: existingPayment ? true : false,
    });
  } catch (err) {
    next(err);
    console.error("Stripe session fetch failed:", err.message);
  }
};

export const getAllPaymentDetails = async (req, res, next) => {
  try {
    const getAllPayments = await paymentModel.find({});
    if (!getAllPayments) {
      throw new AppError("Payment details not available", 404);
    }
    res
      .status(200)
      .json({ message: "Payment details fetched", data: getAllPayments });
  } catch (error) {
    next(error);
  }
};
