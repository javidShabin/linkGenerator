// controllers/qrCodeController.js
import QRCode from "qrcode";
import QRCodeModel from "../models/qrModel.js";
import linkModel from "../models/linkModel.js";
import { AppError } from "../utils/AppError.js";

export const generateQrCode = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const userId = req.user.id;

    // Find the WhatsApp link from the Link model
    const link = await linkModel.findOne({ slug });
    if (!link) throw new AppError("Link not found", 404);

    // Optional: prevent duplicate QR generation for same link
    const existingQR = await QRCodeModel.findOne({
      linkId: link._id,
      generatedFor: "whatsappLink",
    });

    if (existingQR) {
      return res.status(200).json({
        success: true,
        message: "QR code already exists",
        data: existingQR,
      });
    }

    // Generate QR code from the WhatsApp link
    const qrCodeImage = await QRCode.toDataURL(link.whatsappLink);

    // Save QR code to DB
    const newQR = new QRCodeModel({
      userId,
      linkId: link._id,
      qrCodeImage,
      generatedFor: "whatsappLink",
    });

    await newQR.save();

    res.status(201).json({
      success: true,
      message: "QR code generated successfully",
      data: newQR,
    });
  } catch (error) {
    next(error);
  }
};

// controllers/qrCodeController.js
export const downloadQrCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format = "png" } = req.query; // default to PNG

    const qr = await QRCodeModel.findById(id);
    if (!qr) throw new AppError("QR code not found", 404);

    qr.downloadCount += 1;
    await qr.save();

    const mimeTypes = {
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
      svg: "image/svg+xml",
    };

    if (!mimeTypes[format]) {
      return res.status(400).json({ message: "Unsupported format" });
    }

    const options = {
      type: format === "svg" ? "svg" : "image",
      rendererOpts: {
        quality: 0.92,
      },
    };

    QRCode.toBuffer(qr.whatsappLink, options, (err, buffer) => {
      if (err) return next(new AppError("QR generation failed", 500));

      res.setHeader("Content-Type", mimeTypes[format]);
      res.setHeader("Content-Disposition", `attachment; filename=qr-code.${format}`);
      res.send(buffer);
    });
  } catch (error) {
    next(error);
  }
};
