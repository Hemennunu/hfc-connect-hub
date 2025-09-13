const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const BoardDirector = require('../models/boardDirector.js');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

// Create uploads directory if it doesn't exist
const uploadDir = 'uploads/boardDirectors';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Get all board directors (public)
router.get("/", async (req, res) => {
  try {
    const directors = await BoardDirector.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
    res.json(directors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single board director by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const director = await BoardDirector.findById(req.params.id);
    if (!director) return res.status(404).json({ message: "Board director not found" });
    res.json(director);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new board director (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    console.log('Creating new board director:', req.body);
    const director = new BoardDirector(req.body);
    const savedDirector = await director.save();
    
    // Emit update event to clients
    const io = getIo();
    io.emit('boardDirectorsUpdated');
    console.log('Board director created and socket event emitted');
    
    res.status(201).json(savedDirector);
  } catch (err) {
    console.error('Error creating board director:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update board director (admin only)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    console.log('Updating board director:', req.params.id, req.body);
    const director = await BoardDirector.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!director) return res.status(404).json({ message: "Board director not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('boardDirectorsUpdated');
    console.log('Board director updated and socket event emitted');

    res.json(director);
  } catch (err) {
    console.error('Error updating board director:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete board director (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    console.log('Deleting board director:', req.params.id);
    const director = await BoardDirector.findByIdAndDelete(req.params.id);
    if (!director) return res.status(404).json({ message: "Board director not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('boardDirectorsUpdated');
    console.log('Board director deleted and socket event emitted');

    res.json({ message: "Board director deleted successfully" });
  } catch (err) {
    console.error('Error deleting board director:', err);
    res.status(500).json({ message: err.message });
  }
});

// Toggle active status (admin only)
router.patch("/:id/toggle-status", auth, adminOnly, async (req, res) => {
  try {
    console.log('Toggling board director status:', req.params.id);
    const director = await BoardDirector.findById(req.params.id);
    if (!director) return res.status(404).json({ message: "Board director not found" });

    director.isActive = !director.isActive;
    await director.save();

    // Emit update event to clients
    const io = getIo();
    io.emit('boardDirectorsUpdated');
    console.log('Board director status toggled and socket event emitted');

    res.json(director);
  } catch (err) {
    console.error('Error toggling board director status:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
