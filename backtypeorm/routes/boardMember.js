const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const BoardMember = require('../entities/BoardMember');
const { auth, adminOnly } = require('../middleware/auth');

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
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    
    const newBoardMember = boardMemberRepository.create(req.body);
    const savedBoardMember = await boardMemberRepository.save(newBoardMember);
    
    res.status(201).json(savedBoardMember);
  } catch (error) {
    console.error('Error creating board member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/board-members/:id - Update board member (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const boardMemberRepository = AppDataSource.getRepository(BoardMember);
    
    const boardMember = await boardMemberRepository.findOne({ where: { id: req.params.id } });
    if (!boardMember) {
      return res.status(404).json({ message: 'Board member not found' });
    }
    
    await boardMemberRepository.update(req.params.id, req.body);
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
