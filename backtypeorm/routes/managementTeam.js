const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const ManagementTeam = require('../entities/ManagementTeam');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/management-team - Get all active management team members (public route)
router.get('/', async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const managementTeam = await managementTeamRepository.find({
      where: { isActive: true },
      order: { order: 'ASC' }
    });
    res.json(managementTeam);
  } catch (error) {
    console.error('Error fetching management team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/management-team/all - Get all management team members including inactive (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const managementTeam = await managementTeamRepository.find({
      order: { order: 'ASC' }
    });
    res.json(managementTeam);
  } catch (error) {
    console.error('Error fetching all management team:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/management-team/:id - Get single management team member by ID
router.get('/:id', async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const managementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    
    if (!managementMember) {
      return res.status(404).json({ message: 'Management team member not found' });
    }
    
    res.json(managementMember);
  } catch (error) {
    console.error('Error fetching management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/management-team - Create new management team member (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    
    const newManagementMember = managementTeamRepository.create(req.body);
    const savedManagementMember = await managementTeamRepository.save(newManagementMember);
    
    res.status(201).json(savedManagementMember);
  } catch (error) {
    console.error('Error creating management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/management-team/:id - Update management team member (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    
    const managementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    if (!managementMember) {
      return res.status(404).json({ message: 'Management team member not found' });
    }
    
    await managementTeamRepository.update(req.params.id, req.body);
    const updatedManagementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedManagementMember);
  } catch (error) {
    console.error('Error updating management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/management-team/:id - Delete management team member (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    
    const managementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    if (!managementMember) {
      return res.status(404).json({ message: 'Management team member not found' });
    }
    
    await managementTeamRepository.delete(req.params.id);
    res.json({ message: 'Management team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
