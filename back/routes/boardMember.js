import express from "express";
import BoardMember from "../models/BoardMember.js";
import { authenticate, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all board members (public)
router.get("/", async (req, res) => {
  try {
    const boardMembers = await BoardMember.find();
    res.json(boardMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create board member (admin only)
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const member = new BoardMember(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update board member by ID (admin only)
router.put("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const member = await BoardMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });
    Object.assign(member, req.body);
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete board member (admin only)
router.delete("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const member = await BoardMember.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Not found" });
    await member.remove();
    res.json({ message: "Board member deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
