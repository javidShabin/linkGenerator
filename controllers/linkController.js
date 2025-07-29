import linkModel from "../models/linkModel.js";
import userModel from "../models/userModel.js";
import { AppError } from "../utils/AppError.js";
import { generateSlug, generateWhatsAppLink } from "../utils/generateLink.js";

// ******************* Link generating controllers ********************

// Create whatsapp link
export const createLink = async (req, res, next) => {
  try {
    const { phone, message, customSlug } = req.body;
    const userId = req.user.id;

    if (!phone) return next(new AppError("Phone number is required", 400));
    if (!message) return next(new AppError("Message is required", 400));

    const slug = generateSlug(customSlug);
    const whatsappLink = generateWhatsAppLink(phone, message);

    let brandedPageUrl = null;
    let username = null;

    const user = await userModel.findById(userId);
    if (!user) return next(new AppError("User not found", 404));

    if (user.isPro) {
      if (!user.userName) {
        return next(new AppError("Username required for branded page", 400));
      }

      username = user.userName;
      brandedPageUrl = `${process.env.CLIENT_URL}/${username}`;
    }

    const newLink = new linkModel({
      userId,
      slug,
      phone,
      message,
      whatsappLink,
      brandedPageUrl,
      username,
    });

    await newLink.save();

    res.status(201).json({
      success: true,
      message: "Link generated successfully",
      data: {
        slug: newLink.slug,
        whatsappLink: newLink.whatsappLink,
        brandedPageUrl: newLink.brandedPageUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get the latest link and user details for the logged-in user
export const getLatestLink = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch latest link for user
    const latestLink = await linkModel.findOne({ userId }).sort({ createdAt: -1 });

    if (!latestLink) {
      return next(new AppError("No link found for this user", 404));
    }

    // Fetch user details
    const user = await userModel.findById(userId).select("name email userName isPro profilePic");

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Latest link and user details fetched successfully",
      data: {
        slug: latestLink.slug,
        whatsappLink: latestLink.whatsappLink,
        brandedPageUrl: latestLink.brandedPageUrl,
        user: {
          name: user.name,
          email: user.email,
          userName: user.userName,
          isPro: user.isPro,
          profilePic: user.profilePic,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get previous links
export const getPrevLinks = async (req, res, next) => {
  try {
    // Get user id from authentication
    const userId = req.user.id;
    // Find all links by user id
    const links = await linkModel.find({ userId });
    // If not get any links throw error
    if (!links) {
      throw new AppError("Not previous link not found", 404);
    }
    res
      .status(200)
      .json({ success: true, message: "Previous links fetched", data: links });
  } catch (error) {
    next(error);
  }
};

// Track link usage
export const trachLinkUsage = async (req, res, next) => {
  try {
    // Destructer the slug from request params
    const { slug } = req.params;
    // Find the link using the slug
    const link = await linkModel.findOne({ slug });
    // The link is not found throw error
    if (!link) {
      throw new AppError("Link not found", 404);
    }
    // Increment the clicks count
    link.clicks = (link.clicks || 0) + 1;
    await link.save(); // save the count
    // Send the response to client
    res.status(200).json({
      success: true,
      message: "Link usage tracked",
      clicks: link.clicks,
    });
  } catch (error) {
    next(error);
  }
};

// Update the link
export const updateLink = async (req, res, next) => {
  try {
    // Get the slug from the request parameters
    const { slug } = req.params;
    // Get details from request body
    const { phone, message, customSlug } = req.body;
    // Find the link by slug
    const existingLink = await linkModel.findOne({ slug });

    // Check if the link exists
    if (!existingLink) {
      throw new AppError("Link is not found", 404);
    }

    // Update fields if provided
    if (phone) existingLink.phone = phone;
    if (message !== undefined) existingLink.message = message;

    // Optional: Regenerate slug if customSlug provided
    if (customSlug) {
      existingLink.slug = generateSlug(customSlug);
    }

    // Regenerate WhatsApp link
    existingLink.whatsappLink = generateWhatsAppLink(
      existingLink.phone,
      existingLink.message
    );

    // Save the updated link
    await existingLink.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Link updated successfully",
      data: existingLink,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a link
export const deleteLink = async (req, res, next) => {
  try {
    // Get the slug from request params
    const { slug } = req.params;
    // Find the link by slug
    const deletedLink = await linkModel.findOneAndDelete({ slug });
    if (!deletedLink) throw new AppError("Link not found", 404); // Not found any link by the sluge throw error

    // Send response to client
    res.status(200).json({
      success: true,
      message: "Link deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


