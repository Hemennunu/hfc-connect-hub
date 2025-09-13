import express from "express";
import OrganizationalProfile from "../models/organizationalProfile.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get the organizational profile (public)
router.get("/", async (req, res) => {
  try {
    const profile = await OrganizationalProfile.findOne().sort({ createdAt: -1 });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update profile (admin only)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const existing = await OrganizationalProfile.findOne();
    if (existing) {
      Object.assign(existing, req.body);
      await existing.save();
      return res.json(existing);
    }
    const profile = new OrganizationalProfile(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
