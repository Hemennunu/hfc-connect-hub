const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const AppDataSource = require('../config/database');
const ManagementTeam = require('../entities/ManagementTeam');
const { auth, adminOnly } = require('../middleware/auth');

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/managementTeam/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'management-team-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

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
router.post('/', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    const { name, position, bio, expertise, email, phone, linkedinUrl, linkedin, department, profileImageUrl } = req.body;
    
    if (!name || !position) {
      return res.status(400).json({ message: 'Name and position are required' });
    }
    
    const finalProfileImageUrl = req.file 
      ? `/uploads/managementTeam/${req.file.filename}` 
      : (profileImageUrl || null);
    
    const newManagementMember = managementTeamRepository.create({
      name,
      position,
      bio,
      expertise,
      email,
      phone,
      linkedinUrl: linkedinUrl || linkedin,
      department,
      image: finalProfileImageUrl,
      isActive: true,
      order: 0
    });
    
    const savedManagementMember = await managementTeamRepository.save(newManagementMember);
    res.status(201).json(savedManagementMember);
  } catch (error) {
    console.error('Error creating management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/management-team/:id - Update management team member (protected route)
router.put('/:id', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    
    const managementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    if (!managementMember) {
      return res.status(404).json({ message: 'Management team member not found' });
    }
    
    const updateData = { ...req.body };
    
    // Handle image upload
    if (req.file) {
      updateData.image = `/uploads/managementTeam/${req.file.filename}`;
    } else if (req.body.profileImageUrl) {
      updateData.image = req.body.profileImageUrl;
    }
    
    // Clean up the update data
    delete updateData.profileImageUrl;
    
    await managementTeamRepository.update(req.params.id, updateData);
    const updatedManagementMember = await managementTeamRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedManagementMember);
  } catch (error) {
    console.error('Error updating management team member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/management-team/:id/toggle-status - Toggle management team member status (protected route)
router.patch('/:id/toggle-status', auth, adminOnly, async (req, res) => {
  try {
    const managementTeamRepository = AppDataSource.getRepository(ManagementTeam);
    
    const managementMember = await managementTeamRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!managementMember) {
      return res.status(404).json({ message: 'Management team member not found' });
    }
    
    const newStatus = !managementMember.isActive;
    await managementTeamRepository.update(parseInt(req.params.id), { isActive: newStatus });
    
    const updatedManagementMember = await managementTeamRepository.findOne({ where: { id: parseInt(req.params.id) } });
    res.json(updatedManagementMember);
  } catch (error) {
    console.error('Error toggling management team member status:', error);
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
