import QRCode from "qrcode";
import QRCodeModel from "../models/qrModel.js";
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

    // Check if a QR code has already been generated for this user-link pair
    let qrCode = await QRCodeModel.findOne({ userId, linkId: link._id, generatedFor: "whatsappLink" });

    // Generate the QR code image if not already present
    let qrCodeImage;
    if (!qrCode) {
      try {
        qrCodeImage = await QRCode.toDataURL(whatsappLink);
      } catch (err) {
        return next(new AppError("Failed to generate QR code", 500));
      }

      qrCode = await QRCodeModel.create({
        userId,
        linkId: link._id,
        whatsappLink,
        qrCodeImage,
        generatedFor: "whatsappLink",
      });
    }

    // Optionally, you may want to exclude sensitive fields from the response
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

    if (!qr.whatsappLink || typeof qr.whatsappLink !== "string") {
      return next(new AppError("Invalid or missing WhatsApp link", 400));
    }

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

    // Increment download count
    qr.downloadCount = (qr.downloadCount || 0) + 1;
    await qr.save();

    // Set QR options
    const options = {
      type: format === "svg" ? "svg" : "image",
      rendererOpts: {
        quality: 0.92,
      },
    };

    // Generate and send QR code buffer
    QRCode.toBuffer(qr.whatsappLink, { type: options.type, rendererOpts: options.rendererOpts }, (err, buffer) => {
      if (err) {
        console.error("QR generation failed:", err);
        return next(new AppError("QR generation failed", 500));
      }
      res.setHeader("Content-Type", mimeTypes[format]);
      res.setHeader("Content-Disposition", `attachment; filename=qr-code.${format}`);
      res.send(buffer);
    });

  } catch (error) {
    next(error);
  }
};