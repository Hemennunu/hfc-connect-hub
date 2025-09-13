import express from "express";
import ContactInfo from "../models/Contact.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get contact info (public)
router.get("/", async (req, res) => {
  try {
    const info = await ContactInfo.findOne();
    res.json(info);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update contact info (admin only)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    let info = await ContactInfo.findOne();
    if (info) {
      Object.assign(info, req.body);
      await info.save();
      return res.json(info);
    }
    info = new ContactInfo(req.body);
    await info.save();
    res.status(201).json(info);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
