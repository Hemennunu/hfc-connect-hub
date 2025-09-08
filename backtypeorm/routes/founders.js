const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const FounderProfile = require('../entities/FounderProfile');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/founders - Get all active founder profiles (public route)
router.get('/', async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    const founders = await founderRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
    res.json(founders);
  } catch (error) {
    console.error('Error fetching founders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/founders/all - Get all founder profiles including inactive (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    const founders = await founderRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(founders);
  } catch (error) {
    console.error('Error fetching all founders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/founders/:id - Get single founder by ID
router.get('/:id', async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    const founder = await founderRepository.findOne({ where: { id: req.params.id } });
    
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    
    res.json(founder);
  } catch (error) {
    console.error('Error fetching founder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/founders - Create new founder profile (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    
    const founderData = {
      ...req.body,
      socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : null
    };
    
    const newFounder = founderRepository.create(founderData);
    const savedFounder = await founderRepository.save(newFounder);
    
    res.status(201).json(savedFounder);
  } catch (error) {
    console.error('Error creating founder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/founders/:id - Update founder profile (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    
    const founder = await founderRepository.findOne({ where: { id: req.params.id } });
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    
    const updateData = {
      ...req.body,
      socialLinks: req.body.socialLinks ? JSON.parse(req.body.socialLinks) : founder.socialLinks
    };
    
    await founderRepository.update(req.params.id, updateData);
    const updatedFounder = await founderRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedFounder);
  } catch (error) {
    console.error('Error updating founder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/founders/:id - Delete founder profile (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const founderRepository = AppDataSource.getRepository(FounderProfile);
    
    const founder = await founderRepository.findOne({ where: { id: req.params.id } });
    if (!founder) {
      return res.status(404).json({ message: 'Founder not found' });
    }
    
    await founderRepository.delete(req.params.id);
    res.json({ message: 'Founder profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting founder:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
