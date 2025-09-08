const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const ThematicArea = require('../entities/ThematicArea');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/thematic-areas - Get all thematic areas (public)
router.get('/', async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    const thematicAreas = await thematicAreaRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(thematicAreas);
  } catch (error) {
    console.error('Error fetching thematic areas:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/thematic-areas/all - Get all thematic areas including inactive (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    const thematicAreas = await thematicAreaRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(thematicAreas);
  } catch (error) {
    console.error('Error fetching all thematic areas:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/thematic-areas/:id - Get single thematic area by ID
router.get('/:id', async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    const thematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    
    if (!thematicArea) {
      return res.status(404).json({ message: 'Thematic area not found' });
    }
    
    res.json(thematicArea);
  } catch (error) {
    console.error('Error fetching thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/thematic-areas - Create thematic area (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { category, description, icon, color, order, isActive } = req.body;
    
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    const newThematicArea = thematicAreaRepository.create({
      category,
      description,
      icon,
      color,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedThematicArea = await thematicAreaRepository.save(newThematicArea);
    
    res.status(201).json(savedThematicArea);
  } catch (error) {
    console.error('Error creating thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/thematic-areas/:id - Update thematic area (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { category, description, icon, color, order, isActive } = req.body;
    
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    
    const thematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    if (!thematicArea) {
      return res.status(404).json({ message: 'Thematic area not found' });
    }
    
    const updateData = {
      category,
      description,
      icon,
      color,
      order: order || thematicArea.order,
      isActive: isActive !== undefined ? isActive : thematicArea.isActive
    };
    
    await thematicAreaRepository.update(req.params.id, updateData);
    const updatedThematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedThematicArea);
  } catch (error) {
    console.error('Error updating thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/thematic-areas/:id/toggle-status - Toggle active status (admin only)
router.patch('/:id/toggle-status', auth, adminOnly, async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    
    const thematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    if (!thematicArea) {
      return res.status(404).json({ message: 'Thematic area not found' });
    }
    
    await thematicAreaRepository.update(req.params.id, { isActive: !thematicArea.isActive });
    const updatedThematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedThematicArea);
  } catch (error) {
    console.error('Error toggling thematic area status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/thematic-areas/:id - Delete thematic area (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    
    const thematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    if (!thematicArea) {
      return res.status(404).json({ message: 'Thematic area not found' });
    }
    
    await thematicAreaRepository.delete(req.params.id);
    
    res.json({ message: 'Thematic area deleted successfully' });
  } catch (error) {
    console.error('Error deleting thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
