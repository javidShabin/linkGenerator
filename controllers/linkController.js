import linkModel from "../models/linkModel.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug, generateWhatsAppLink } from "../utils/generateLink.js";

// ******************* Link generating controllers ********************

// Create whatsapp link
export const createLink = async (req, res, next) => {
  try {
    // Destructer the user phone number slug and message from request body
    const { phone, message, customSlug } = req.body;
    // Get user id from authentication
    const userId = req.user.id;
    // Generete the link pass customer to the generating function
    const slug = generateSlug(customSlug);
    const fullLink = generateWhatsAppLink(phone, message);

    // Create and save the new whatsapp generated link
    const newLink = new linkModel({
      slug,
      whatsappLink: fullLink,
      phone,
      message,
      userId,
    });
    await newLink.save();
    // Send response to client
    res.status(201).json({
      success: true,
      message: "Link is generated",
      data: newLink,
    });
  } catch (error) {
    next(error);
  }
};

// Get previous links
export const getPrevLinks = async (req, res, next) => {
  try {
    // Get user id from authentication
    const userId = req.user.id
    // Find all links by user id
    const links = await linkModel.find({userId})
    // If not get any links throw error
    if (!links) {
      throw new AppError("Not previous link not found", 400)
    }
    res.status(200).json({success: true, message: "Previous links fetched", data: links})
  } catch (error) {
    next(error)
  }
}