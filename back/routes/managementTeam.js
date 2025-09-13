const express = require('express');
const router = express.Router();
const ManagementTeam = require('../models/managementTeam.js');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

// Get all management team members (public)
router.get("/", async (req, res) => {
  try {
    const members = await ManagementTeam.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single management team member by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const member = await ManagementTeam.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Management team member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new management team member (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    console.log('Creating new management team member:', req.body);
    const member = new ManagementTeam(req.body);
    const savedMember = await member.save();
    
    // Emit update event to clients
    const io = getIo();
    io.emit('managementTeamUpdated');
    console.log('Management team member created and socket event emitted');
    
    res.status(201).json(savedMember);
  } catch (err) {
    console.error('Error creating management team member:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update management team member (admin only)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    console.log('Updating management team member:', req.params.id, req.body);
    const member = await ManagementTeam.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!member) return res.status(404).json({ message: "Management team member not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('managementTeamUpdated');
    console.log('Management team member updated and socket event emitted');

    res.json(member);
  } catch (err) {
    console.error('Error updating management team member:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete management team member (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    console.log('Deleting management team member:', req.params.id);
    const member = await ManagementTeam.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ message: "Management team member not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('managementTeamUpdated');
    console.log('Management team member deleted and socket event emitted');

    res.json({ message: "Management team member deleted successfully" });
  } catch (err) {
    console.error('Error deleting management team member:', err);
    res.status(500).json({ message: err.message });
  }
});

// Toggle active status (admin only)
router.patch("/:id/toggle-status", auth, adminOnly, async (req, res) => {
  try {
    console.log('Toggling management team member status:', req.params.id);
    const member = await ManagementTeam.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Management team member not found" });

    member.isActive = !member.isActive;
    await member.save();

    // Emit update event to clients
    const io = getIo();
    io.emit('managementTeamUpdated');
    console.log('Management team member status toggled and socket event emitted');

    res.json(member);
  } catch (err) {
    console.error('Error toggling management team member status:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
