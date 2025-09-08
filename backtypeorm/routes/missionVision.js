const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const MissionVision = require('../entities/MissionVision');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/mission-vision - Get mission and vision (public)
router.get('/', async (req, res) => {
  try {
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    const missionVision = await missionVisionRepository.findOne({
      order: { createdAt: 'DESC' }
    });
    
    if (!missionVision) {
      return res.status(404).json({ message: 'Mission and vision not found' });
    }
    
    res.json(missionVision);
  } catch (error) {
    console.error('Error fetching mission and vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/mission-vision - Create mission and vision (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { mission, vision, values } = req.body;
    
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    
    // Check if mission/vision already exists
    const existing = await missionVisionRepository.findOne({});
    if (existing) {
      return res.status(400).json({ message: 'Mission and vision already exists. Use PUT to update.' });
    }
    
    const newMissionVision = missionVisionRepository.create({
      mission,
      vision,
      values
    });
    
    const savedMissionVision = await missionVisionRepository.save(newMissionVision);
    
    res.status(201).json(savedMissionVision);
  } catch (error) {
    console.error('Error creating mission and vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/mission-vision/:id - Update mission and vision (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { mission, vision, values } = req.body;
    
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    
    const missionVision = await missionVisionRepository.findOne({ where: { id: req.params.id } });
    if (!missionVision) {
      return res.status(404).json({ message: 'Mission and vision not found' });
    }
    
    const updateData = {
      mission,
      vision,
      values
    };
    
    await missionVisionRepository.update(req.params.id, updateData);
    const updatedMissionVision = await missionVisionRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedMissionVision);
  } catch (error) {
    console.error('Error updating mission and vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/mission-vision/:id - Delete mission and vision (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    
    const missionVision = await missionVisionRepository.findOne({ where: { id: req.params.id } });
    if (!missionVision) {
      return res.status(404).json({ message: 'Mission and vision not found' });
    }
    
    await missionVisionRepository.delete(req.params.id);
    
    res.json({ message: 'Mission and vision deleted successfully' });
  } catch (error) {
    console.error('Error deleting mission and vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
