const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const router = express.Router();
const AppDataSource = require('../config/database');
const BoardMember = require('../entities/BoardMember');
const { auth, adminOnly } = require('../middleware/auth');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/boardMembers');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for board members
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/boardMembers/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// GET /api/board-members - Get all board members (public route)
router.get('/', async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const boardMembers = await boardMemberRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(boardMembers);
  } catch (error) {
    console.error('Error fetching board members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/board-members/all - Get all board members including inactive (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const boardMembers = await boardMemberRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(boardMembers);
  } catch (error) {
    console.error('Error fetching all board members:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/board-members/:id - Get single board member by ID
router.get('/:id', async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const boardMember = await boardMemberRepository.findOne({ where: { id: req.params.id } });
    
    if (!boardMember) {
      return res.status(404).json({ message: 'Board member not found' });
    }
    
    res.json(boardMember);
  } catch (error) {
    console.error('Error fetching board member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/board-members - Create new board member (protected route)
router.post('/', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    const { name, role, education, bio, linkedinProfile, order, isActive, profileImageUrl } = req.body;
    
    if (!name || !role) {
      return res.status(400).json({ message: 'Name and role are required' });
    }

    let finalProfileImage = null;
    if (req.file) {
      finalProfileImage = req.file.filename;
    } else if (profileImageUrl) {
      // Download external image and save locally
      const response = await axios({ url: profileImageUrl, responseType: 'stream' });
      const filename = `board-member-${Date.now()}${path.extname(profileImageUrl)}`;
      const imagePath = path.join(__dirname, '../uploads/boardMembers', filename);
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      finalProfileImage = filename;
    }

    const newBoardMember = boardMemberRepository.create({
      name,
      role,
      education,
      bio,
      profileImage: finalProfileImage,
      linkedinProfile,
      order: order ? parseInt(order) : 0,
      isActive: isActive === 'true' || isActive === true,
    });
    const savedBoardMember = await boardMemberRepository.save(newBoardMember);
    
    res.status(201).json(savedBoardMember);
  } catch (error) {
    console.error('Error creating board member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/board-members/:id - Update board member (protected route)
router.put('/:id', auth, adminOnly, upload.single('profileImage'), async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    
    const boardMember = await boardMemberRepository.findOne({ where: { id: req.params.id } });
    if (!boardMember) {
      return res.status(404).json({ message: 'Board member not found' });
    }
    
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.role) updateData.role = req.body.role;
    if (req.body.education) updateData.education = req.body.education;
    if (req.body.bio) updateData.bio = req.body.bio;
    if (req.body.linkedinProfile) updateData.linkedinProfile = req.body.linkedinProfile;
    if (req.body.order) updateData.order = parseInt(req.body.order);
    if (req.body.isActive !== undefined) updateData.isActive = req.body.isActive === 'true' || req.body.isActive === true;

    if (req.file) {
      updateData.profileImage = req.file.filename;
    } else if (req.body.profileImageUrl && req.body.profileImageUrl !== boardMember.profileImage) {
      // Download external image and save locally
      const response = await axios({ url: req.body.profileImageUrl, responseType: 'stream' });
      const filename = `board-member-${Date.now()}${path.extname(req.body.profileImageUrl)}`;
      const imagePath = path.join(__dirname, '../uploads/boardMembers', filename);
      const writer = fs.createWriteStream(imagePath);
      response.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      updateData.profileImage = filename;
    } else if (req.body.profileImageUrl === '') {
      updateData.profileImage = null; // Clear the image if an empty string is sent
    }

    await boardMemberRepository.update(req.params.id, updateData);
    const updatedBoardMember = await boardMemberRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedBoardMember);
  } catch (error) {
    console.error('Error updating board member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/board-members/:id - Delete board member (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    
    const boardMember = await boardMemberRepository.findOne({ where: { id: req.params.id } });
    if (!boardMember) {
      return res.status(404).json({ message: 'Board member not found' });
    }
    
    await boardMemberRepository.delete(req.params.id);
    res.json({ message: 'Board member deleted successfully' });
  } catch (error) {
    console.error('Error deleting board member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
