import express from "express";
import Donation from "../models/Donation.js";

const router = express.Router();

// Post a donation (public)
router.post("/", async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    // Future: integrate payment gateways and notifications
    res.status(201).json({ message: "Thank you for your donation!", donationId: donation._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin get all donations (admin only)
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

router.get("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
