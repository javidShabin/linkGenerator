import { cloudinaryInstance } from "../config/cloudinary.js";
import fs from "fs";

export const uploadToCloudinary = async (filePath) => {
  try {
    // Log the path to verify in Render
    console.log("Uploading to Cloudinary from path:", filePath);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found at path:", filePath);
      return {
        success: false,
        message: "File does not exist",
      };
    }

    const result = await cloudinaryInstance.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "link-generator", // Optional: add folder name in Cloudinary
    });

    // Delete local file after upload (Render cleanup)
    fs.unlinkSync(filePath);

    return {
      success: true,
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);

    return {
      success: false,
      message: "File upload failed",
      error: error.message,
    };
  }
};
