const express = require('express');
const multer = require('multer');
const path = require('path');
const Alumni = require('../models/Alumni');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/alumni/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'alumni-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 2 * 1024 * 1024, // Reduced to 2MB limit
    fieldSize: 1024 * 1024 // 1MB field size limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get public alumni profiles (for frontend display)
router.get('/public', async (req, res) => {
  try {
    const alumni = await Alumni.find({ 
      consented: true, 
      isPublic: true 
    }).sort({ graduationYear: -1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all alumni (admin only - for management)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const alumni = await Alumni.find().sort({ createdAt: -1 });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single alumni by ID
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const alumni = await Alumni.findById(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Alumni registration form (public) - DISABLED
// This route is disabled as alumni are now managed only through admin panel
router.post('/register', (req, res) => {
  res.status(403).json({ 
    message: 'Public registration is disabled. Alumni profiles are managed through the admin panel.' 
  });
});

// Create new alumni (admin only)
router.post('/', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const alumniData = {
      ...req.body,
      achievements: req.body.achievements ? JSON.parse(req.body.achievements) : [],
      profileImage: req.file ? req.file.filename : null,
      // Admin-created alumni are automatically approved and public
      consented: true,
      isPublic: true,
      createdByAdmin: true
    };
    
    const newAlumni = new Alumni(alumniData);
    await newAlumni.save();
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('alumniCreated', newAlumni);
    }
    
    res.status(201).json(newAlumni);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
});

// Update alumni (admin only)
router.put('/:id', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      achievements: req.body.achievements ? JSON.parse(req.body.achievements) : [],
      updatedAt: new Date()
    };
    
    if (req.file) {
      updateData.profileImage = req.file.filename;
    }
    
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('alumniUpdated', alumni);
    }
    
    res.json(alumni);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete alumni (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('alumniDeleted', req.params.id);
    }
    
    res.json({ message: 'Alumni deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve consent and make public (admin only)
router.patch('/:id/approve', auth, adminOnly, async (req, res) => {
  try {
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { 
        consented: true, 
        isPublic: true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }
    
    // Emit real-time update
    if (req.io) {
      req.io.emit('alumniApproved', alumni);
    }
    
    res.json({ message: 'Alumni profile approved and made public', alumni });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search alumni (admin only)
router.get('/search/:query', auth, adminOnly, async (req, res) => {
  try {
    const query = req.params.query;
    const alumni = await Alumni.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { currentOccupation: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { location: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
