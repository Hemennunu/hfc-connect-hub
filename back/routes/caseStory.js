const express = require('express');
const multer = require('multer');
const path = require('path');
const CaseStory = require('../models/CaseStory');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/caseStories/');
  },
  filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all case stories (public)
router.get('/', async (req, res) => {
  try {
    const stories = await CaseStory.find().sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get case story by ID
router.get('/:id', async (req, res) => {
  try {
    const story = await CaseStory.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Case story not found' });
    }
    res.json(story);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create case story (admin only)
router.post('/', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    const { 
      title, 
      content, 
      summary, 
      beneficiaryName, 
      location, 
      category, 
      mediaType, 
      impact, 
      tags, 
      featured 
    } = req.body;
    
    const mediaUrl = req.file ? `/uploads/caseStories/${req.file.filename}` : null;
    const thumbnailUrl = req.file && mediaType === 'video' ? `/uploads/caseStories/thumbnails/${req.file.filename}.jpg` : null;

    const story = new CaseStory({ 
      title, 
      content, 
      summary, 
      beneficiaryName, 
      location, 
      category, 
      mediaType: mediaType || 'text', 
      mediaUrl, 
      thumbnailUrl,
      impact, 
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featured: featured === 'true',
      createdBy: req.user.id
    });
    
    await story.save();

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryAdded', story);
    }

    res.status(201).json(story);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update case story (admin only)
router.put('/:id', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    const { 
      title, 
      content, 
      summary, 
      beneficiaryName, 
      location, 
      category, 
      mediaType, 
      impact, 
      tags, 
      featured 
    } = req.body;
    
    const updateData = { 
      title, 
      content, 
      summary, 
      beneficiaryName, 
      location, 
      category, 
      mediaType: mediaType || 'text', 
      impact, 
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      featured: featured === 'true',
      updatedAt: new Date()
    };

    // If new media uploaded, update media fields
    if (req.file) {
      updateData.mediaUrl = `/uploads/caseStories/${req.file.filename}`;
      if (mediaType === 'video') {
        updateData.thumbnailUrl = `/uploads/caseStories/thumbnails/${req.file.filename}.jpg`;
      }
    }

    const story = await CaseStory.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!story) {
      return res.status(404).json({ message: 'Case story not found' });
    }

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryUpdated', story);
    }

    res.json(story);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete case story (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const story = await CaseStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Case story not found' });
    }

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryDeleted', req.params.id);
    }

    res.json({ message: 'Case story deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get featured case stories
router.get('/featured/list', async (req, res) => {
  try {
    const stories = await CaseStory.find({ featured: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get case stories by category
router.get('/category/:category', async (req, res) => {
  try {
    const stories = await CaseStory.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
