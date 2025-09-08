const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const AppDataSource = require('../config/database');
const CaseStory = require('../entities/CaseStory');
const { auth, adminOnly } = require('../middleware/auth');

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
    const { title, content, summary, beneficiaryName, age, location, category, impact, outcome, dateRecorded, publishDate, tags, featured, status } = req.body;
    
    // Validate required fields
    if (!title || !content || !beneficiaryName || !category) {
      return res.status(400).json({ message: 'Title, content, beneficiary name, and category are required' });
    }
    
    const mediaUrl = req.file ? `/uploads/caseStories/${req.file.filename}` : null;
    const mediaType = req.file ? (req.file.mimetype && req.file.mimetype.startsWith('video/') ? 'video' : 'image') : 'image';

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
      featured: (typeof featured === 'string') ? featured === 'true' : !!featured,
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
    const { title, content, summary, beneficiaryName, age, location, category, impact, outcome, dateRecorded, publishDate, tags, featured, status } = req.body;
    
    // Handle tags: convert string to array if needed
    let processedTags = tags;
    if (tags && typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    
    const updateData = {
      title,
      content,
      summary,
      beneficiaryName,
      age: age ? parseInt(age) : null,
      location,
      category,
      impact,
      outcome,
      dateRecorded: dateRecorded ? new Date(dateRecorded) : null,
      publishDate: publishDate ? new Date(publishDate) : null,
      tags: processedTags,
      featured: featured === 'true' || featured === true,
      status: status || 'draft'
    };

    // If new media uploaded, update media fields
    if (req.file) {
      updateData.mediaUrl = `/uploads/caseStories/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    const caseStoryRepository = AppDataSource.getRepository(CaseStory);
    const caseStory = await caseStoryRepository.findOne({ where: { id: req.params.id } });
    if (!caseStory) {
      return res.status(404).json({ message: 'Case story not found' });
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