import QRCode from "qrcode";
import QRCodeModel from "../models/qrModel.js";
import Jimp from "jimp";
import fs from "fs";
import path from "path";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";
import linkModel from "../models/linkModel.js";
import { AppError } from "../utils/AppError.js";

// Generate and store a QR code for a WhatsApp link
export const generateQrCode = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { slug } = req.params;

    // Find the associated link
    const link = await linkModel.findOne({ slug });
    if (!link) {
      return next(new AppError("Link not found", 404));
    }

    const whatsappLink = link.whatsappLink;
    if (!whatsappLink) {
      return next(new AppError("WhatsApp link not found in Link model", 400));
    }

    // Check if QR code already exists
    let qrCode = await QRCodeModel.findOne({
      userId,
      linkId: link._id,
      generatedFor: "whatsappLink",
    });

    // Generate QR if not exists
    if (!qrCode) {
      const qrCodeImage = await QRCode.toDataURL(whatsappLink);

      qrCode = await QRCodeModel.create({
        userId,
        linkId: link._id,
        whatsappLink,
        qrCodeImage,
        generatedFor: "whatsappLink",
        generatedCount: 1, // initialize with 1
      });
    } else {
      // Increment generatedCount
      qrCode.generatedCount += 1;
      await qrCode.save();
    }

    const { userId: uid, ...safeQrCode } = qrCode.toObject();

    res.status(201).json({
      status: "success",
      message: "QR Code generated successfully",
      data: safeQrCode,
    });
  } catch (err) {
    console.error("❌ Controller error:", err);
    next(new AppError("Internal server error", 500));
  }
};

// Download the QR code image in the requested format
export const downloadQrCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const format = (req.query.format || "png").toLowerCase().trim();

    const qr = await QRCodeModel.findById(id);
    if (!qr) {
      return next(new AppError("QR code not found", 404));
    }
console.log(qr.downloadCount)
     // Increment download count
    qr.downloadCount = (qr.downloadCount || 0) + 1;
    await qr.save();

    if (!qr.whatsappLink || typeof qr.whatsappLink !== "string") {
      return next(new AppError("Invalid or missing WhatsApp link", 400));
    }

     // Increment download count
    qr.downloadCount = (qr.downloadCount || 0) + 1;
    await qr.save();


    // Supported formats
    const mimeTypes = {
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      svg: "image/svg+xml",
    };

    if (!mimeTypes[format]) {
      return next(new AppError("Unsupported format", 400));
    }

   
    // Set QR options
    const options = {
      type: format === "svg" ? "svg" : "image",
      rendererOpts: {
        quality: 0.92,
      },
    };

    // Generate and send QR code buffer
    QRCode.toBuffer(
      qr.whatsappLink,
      { type: options.type, rendererOpts: options.rendererOpts },
      (err, buffer) => {
        try {
          if (err) {
            console.error("QR generation failed:", err);
            return next(new AppError("QR generation failed", 500));
          }
          res.setHeader("Content-Type", mimeTypes[format]);
          res.setHeader(
            "Content-Disposition",
            `attachment; filename=qr-code.${format}`
          );
          res.send(buffer);
        } catch (callbackErr) {
          next(callbackErr);
        }
      }
    );
  } catch (error) {
    console.error("Download error:", error);
    next(new AppError("Something went wrong while downloading QR", 500));
  }
};

export const editQrCode = async (req, res, next) => {
  try {
 
    const { id } = req.params;
    const { foregroundColor, backgroundColor } = req.body;

    const qr = await QRCodeModel.findById(id);
    if (!qr) throw new AppError("QR code not found", 404);
    if (req.user.id !== qr.userId.toString()) throw new AppError("Unauthorized", 401);

    let logoUrl = qr.logoUrl;

    // If a new logo is uploaded
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (!uploadResult.success || !uploadResult.url) {
        return res.status(500).json({
          success: false,
          message: uploadResult.message || "Failed to upload logo",
        });
      }
      logoUrl = uploadResult.url;
      qr.logoUrl = logoUrl;
    }

    // Update colors if provided
    if (foregroundColor) qr.foregroundColor = foregroundColor;
    if (backgroundColor) qr.backgroundColor = backgroundColor;

    // Generate QR buffer
    const qrBuffer = await QRCode.toBuffer(qr.whatsappLink, {
      color: {
        dark: foregroundColor || "#000000",
        light: backgroundColor || "#ffffff",
      },
      width: 400,
      errorCorrectionLevel: "H",
    });

    const qrImage = await Jimp.read(qrBuffer);

    // Add logo if exists
    if (logoUrl) {
      const logoImage = await Jimp.read(logoUrl);
      logoImage.resize(100, 100);
      const x = (qrImage.bitmap.width / 2) - (logoImage.bitmap.width / 2);
      const y = (qrImage.bitmap.height / 2) - (logoImage.bitmap.height / 2);
      qrImage.composite(logoImage, x, y);
    }

    // Save temp file
    const tempPath = path.join("/tmp", `${Date.now()}-qr.png`);
    await qrImage.writeAsync(tempPath);

    // Upload to Cloudinary
    const finalUpload = await uploadToCloudinary(tempPath);
    fs.unlinkSync(tempPath); // Delete temp file

    if (!finalUpload.success || !finalUpload.url) {
      throw new AppError("Failed to upload final QR code image to Cloudinary", 500);
    }

    qr.qrCodeImage = finalUpload.url;
    await qr.save();

    res.status(200).json({
      success: true,
      message: "QR code updated successfully",
      qr,
    });

  } catch (error) {
    console.error("Edit QR error:", error);
    next(new AppError("Something went wrong while editing QR", 500));
  }
};