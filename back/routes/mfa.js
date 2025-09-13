import express from "express";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/setup", authenticate, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `YourApp (${req.user.email})`,
    });

    req.user.mfaSecret = secret.base32;
    await req.user.save();

    qrcode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
      if (err) return res.status(500).json({ message: "Failed to generate QR code" });
      res.json({ qrCode: imageUrl, secret: secret.base32 });
    });
  } catch {
    res.status(500).json({ message: "MFA setup failed" });
  }
});

router.post("/verify", authenticate, async (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: req.user.mfaSecret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (!verified) return res.status(401).json({ message: "Invalid MFA token" });

  req.user.mfaEnabled = true;
  await req.user.save();

  res.json({ message: "MFA enabled successfully" });
});

export default router;
