// controllers/qrCodeController.js
import QRCode from "qrcode";
import QRCodeModel from "../models/qrModel.js";
import linkModel from "../models/linkModel.js";
import { AppError } from "../utils/AppError.js";

// controllers/qrCodeController.js
export const generateQrCode = async (req, res, next) => {
  try {
    
    const userId = req.user.id;
    const { name } = req.params;

    const link = await linkModel.findOne({ name });

    if (!link) {
      return next(new AppError("Link not found", 404));
    }

    const whatsappLink = link?.whatsappLink;
    if (!whatsappLink) {
      return next(new AppError("WhatsApp link not found in Link model", 400));
    }

    let qrCodeImage;
    try {
      qrCodeImage = await QRCode.toDataURL(whatsappLink);
  
    } catch (err) {
      
      return next(new AppError("Failed to generate QR code", 500));
    }

    
    const qrCode = await QRCodeModel.create({
      userId,
      linkId: link._id,
      whatsappLink,
      qrCodeImage,
      generatedFor: "whatsappLink",
    });

    res.status(201).json({
      status: "success",
      message: "QR Code generated successfully",
      data: qrCode,
    });

  } catch (err) {
    console.error("❌ Controller error:", err.message);
    next(new AppError("Internal server error", 500));
  }
};





// Download the image needed format
export const downloadQrCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const format = (req.query.format || "png").toLowerCase().trim();

    console.log("Requested format:", format);

    const qr = await QRCodeModel.findById(id);
    
    if (!qr) throw new AppError("QR code not found", 404);

    if (!qr.whatsappLink || typeof qr.whatsappLink !== "string") {
      return res.status(400).json({ message: "Invalid or missing WhatsApp link" });
    }

    qr.downloadCount += 1;
    await qr.save();

    const mimeTypes = {
      png: "image/png",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
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
