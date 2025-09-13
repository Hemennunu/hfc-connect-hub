const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const AppDataSource = require('../config/database');
const CaseStory = require('../entities/CaseStory');
const { auth, adminOnly } = require('../middleware/auth');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/caseStories');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for case stories
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/caseStories/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /api/case-stories - Get all published case stories (public route)
router.get('/', async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const { status } = req.query;
    const where = {};
    if (!status || status === 'published') {
      where.status = 'published';
    } else if (status !== 'all') {
      where.status = status; // e.g., 'draft' or 'archived'
    }
    const caseStories = await caseStoryRepository.find({
      where,
      order: { createdAt: 'DESC' }
    });
    res.json(caseStories);
  } catch (error) {
    console.error('Error fetching case stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/case-stories/all - Get all case stories including unpublished (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStories = await caseStoryRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(caseStories);
  } catch (error) {
    console.error('Error fetching all case stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/case-stories/:id - Get single case story by ID
router.get('/:id', async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStory = await caseStoryRepository.findOne({ where: { id: req.params.id } });
    
    if (!caseStory) {
      return res.status(404).json({ message: 'Case story not found' });
    }
    
    res.json(caseStory);
  } catch (error) {
    console.error('Error fetching case story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/case-stories - Create new case story (protected route)
router.post('/', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    // Handle multipart/form-data
    if (req.headers['content-type']?.includes('multipart/form-data') && !req.body) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    const { title, content, summary, beneficiaryName, age, location, category, impact, outcome, dateRecorded, publishDate, tags, featured, status } = req.body;
    
    // Validate required fields
    if (!title || !content || !beneficiaryName || !category) {
      return res.status(400).json({ message: 'Title, content, beneficiary name, and category are required' });
    }
    
    const mediaUrl = req.file ? `/uploads/caseStories/${req.file.filename}` : null;
    let mediaType = 'text';
    if (req.file) {
      if (req.file.mimetype.startsWith('video/')) {
        mediaType = 'video';
      } else if (req.file.mimetype.startsWith('image/')) {
        mediaType = 'photo';
      } else if (req.file.mimetype.startsWith('audio/')) {
        mediaType = 'audio';
      }
    }

    // Handle tags: convert string to array if needed
    let processedTags = null;
    if (tags) {
      if (typeof tags === 'string') {
        // Split comma-separated string into array
        processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else if (Array.isArray(tags)) {
        processedTags = tags;
      }
    }

    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const newCaseStory = caseStoryRepository.create({
      title,
      content,
      summary,
      beneficiaryName,
      age: age ? parseInt(age) : null,
      location,
      category,
      mediaUrl,
      mediaType,
      impact,
      outcome,
      dateRecorded: dateRecorded ? new Date(dateRecorded) : null,
      publishDate: publishDate ? new Date(publishDate) : null,
      tags: processedTags,
      featured: featured === 'true',
      status: status || 'published',
      createdBy: req.user.id
    });
    
    const savedCaseStory = await caseStoryRepository.save(newCaseStory);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryAdded', savedCaseStory);
    }
    
    res.status(201).json(savedCaseStory);
  } catch (error) {
    console.error('Error creating case story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/case-stories/:id - Update case story (protected route)
router.put('/:id', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStory = await caseStoryRepository.findOne({ where: { id: req.params.id } });
    if (!caseStory) {
      return res.status(404).json({ message: 'Case story not found' });
    }

    const { title, content, summary, beneficiaryName, age, location, category, impact, outcome, dateRecorded, publishDate, tags, featured, status } = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (summary) updateData.summary = summary;
    if (beneficiaryName) updateData.beneficiaryName = beneficiaryName;
    if (age) updateData.age = parseInt(age);
    if (location) updateData.location = location;
    if (category) updateData.category = category;
    if (impact) updateData.impact = impact;
    if (outcome) updateData.outcome = outcome;
    if (dateRecorded) updateData.dateRecorded = new Date(dateRecorded);
    if (publishDate) updateData.publishDate = new Date(publishDate);
    if (tags) {
      if (typeof tags === 'string') {
        updateData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      } else {
        updateData.tags = tags;
      }
    }
    if (featured !== undefined) updateData.featured = featured === 'true';
    if (status) updateData.status = status;

    // If new media uploaded, update media fields
    if (req.file) {
      updateData.mediaUrl = `/uploads/caseStories/${req.file.filename}`;
      updateData.mediaType = 'text';
      if (req.file.mimetype.startsWith('video/')) {
        updateData.mediaType = 'video';
      } else if (req.file.mimetype.startsWith('image/')) {
        updateData.mediaType = 'photo';
      } else if (req.file.mimetype.startsWith('audio/')) {
        updateData.mediaType = 'audio';
      }
    }
    
    await caseStoryRepository.update(req.params.id, updateData);
    const updatedCaseStory = await caseStoryRepository.findOne({ where: { id: req.params.id } });

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryUpdated', updatedCaseStory);
    }
    
    res.json(updatedCaseStory);
  } catch (error) {
    console.error('Error updating case story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/case-stories/:id - Delete case story (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    
    const caseStory = await caseStoryRepository.findOne({ where: { id: req.params.id } });
    if (!caseStory) {
      return res.status(404).json({ message: 'Case story not found' });
    }
    
    await caseStoryRepository.delete(req.params.id);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('caseStoryDeleted', { id: req.params.id });
    }

    res.json({ message: 'Case story deleted successfully' });
  } catch (error) {
    console.error('Error deleting case story:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/case-stories/category/:category - Get case stories by category
router.get('/category/:category', async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStories = await caseStoryRepository.find({
      where: { 
        category: req.params.category,
        status: 'published'
      },
      order: { createdAt: 'DESC' }
    });
    res.json(caseStories);
  } catch (error) {
    console.error('Error fetching case stories by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/case-stories/featured - Get featured case stories
router.get('/featured', async (req, res) => {
  try {
    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStories = await caseStoryRepository.find({
      where: { 
        featured: true,
        status: 'published'
      },
      order: { createdAt: 'DESC' }
    });
    res.json(caseStories);
  } catch (error) {
    console.error('Error fetching featured case stories:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;