import { cloudinaryInstance } from "../config/cloudinary.js";

export const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinaryInstance.uploader.upload(filePath);
    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    return {
      success: false,
      message: "File upload failed",
      error: error.message,
    };
  }
};