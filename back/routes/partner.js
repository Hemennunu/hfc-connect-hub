import express from "express";
import Partner from "../models/partner.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get partners (public)
router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find();
    res.json(partners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin create partner (admin only)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    res.status(201).json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin update partner (admin only)
router.put("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Not found" });
    Object.assign(partner, req.body);
    await partner.save();
    res.json(partner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin delete partner (admin only)
router.delete("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) return res.status(404).json({ message: "Not found" });
    await partner.remove();
    res.json({ message: "Partner deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
