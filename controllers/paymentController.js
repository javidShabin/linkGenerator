// server/controllers/paymentController.js
import stripe from "../utils/stripe.js";

export const createCheckoutSession = async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Pro Plan - WhatsApp Tool',
            },
            unit_amount: 19900, // ₹199 = 19900 paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};
