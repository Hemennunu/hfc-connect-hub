const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const OrganizationalProfile = require('../entities/OrganizationalProfile');
const MissionVision = require('../entities/MissionVision');
const ThematicArea = require('../entities/ThematicArea');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/org-profile - Get organizational profile (public route)
router.get('/', async (req, res) => {
  try {
    const orgProfileRepository = AppDataSource.getRepository(OrganizationalProfile);
    const profiles = await orgProfileRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(profiles);
  } catch (error) {
    console.error('Error fetching organizational profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/org-profile/mission-vision - Get mission and vision (public route)
router.get('/mission-vision', async (req, res) => {
  try {
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    const missionVision = await missionVisionRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(missionVision);
  } catch (error) {
    console.error('Error fetching mission vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/org-profile/thematic-areas - Get thematic areas (public route)
router.get('/thematic-areas', async (req, res) => {
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

// POST /api/org-profile - Create organizational profile (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const orgProfileRepository = AppDataSource.getRepository(OrganizationalProfile);
    
    const profileData = {
      ...req.body,
      brandColors: req.body.brandColors ? JSON.parse(req.body.brandColors) : null,
      establishedYear: req.body.establishedYear ? parseInt(req.body.establishedYear) : null
    };
    
    const newProfile = orgProfileRepository.create(profileData);
    const savedProfile = await orgProfileRepository.save(newProfile);
    
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error('Error creating organizational profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/org-profile/:id - Update organizational profile (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const orgProfileRepository = AppDataSource.getRepository(OrganizationalProfile);
    
    const profile = await orgProfileRepository.findOne({ where: { id: req.params.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Organizational profile not found' });
    }
    
    const updateData = {
      ...req.body,
      brandColors: req.body.brandColors ? JSON.parse(req.body.brandColors) : profile.brandColors,
      establishedYear: req.body.establishedYear ? parseInt(req.body.establishedYear) : profile.establishedYear
    };
    
    await orgProfileRepository.update(req.params.id, updateData);
    const updatedProfile = await orgProfileRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating organizational profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/org-profile/mission-vision - Create/Update mission vision (protected route)
router.post('/mission-vision', auth, adminOnly, async (req, res) => {
  try {
    const missionVisionRepository = AppDataSource.getRepository(MissionVision);
    
    const newMissionVision = missionVisionRepository.create(req.body);
    const savedMissionVision = await missionVisionRepository.save(newMissionVision);
    
    res.status(201).json(savedMissionVision);
  } catch (error) {
    console.error('Error creating mission vision:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/org-profile/thematic-areas - Create thematic area (protected route)
router.post('/thematic-areas', auth, adminOnly, async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    
    const newThematicArea = thematicAreaRepository.create(req.body);
    const savedThematicArea = await thematicAreaRepository.save(newThematicArea);
    
    res.status(201).json(savedThematicArea);
  } catch (error) {
    console.error('Error creating thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/org-profile/thematic-areas/:id - Update thematic area (protected route)
router.put('/thematic-areas/:id', auth, adminOnly, async (req, res) => {
  try {
    const thematicAreaRepository = AppDataSource.getRepository(ThematicArea);
    
    const thematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    if (!thematicArea) {
      return res.status(404).json({ message: 'Thematic area not found' });
    }
    
    await thematicAreaRepository.update(req.params.id, req.body);
    const updatedThematicArea = await thematicAreaRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedThematicArea);
  } catch (error) {
    console.error('Error updating thematic area:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/org-profile/thematic-areas/:id - Delete thematic area (protected route)
router.delete('/thematic-areas/:id', auth, adminOnly, async (req, res) => {
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
