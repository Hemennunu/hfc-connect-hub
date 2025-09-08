const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const BoardDirector = require('../entities/BoardDirector');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/board-directors - Get all board directors (public route)
router.get('/', async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const boardDirectors = await boardDirectorRepository.find({
      order: { order: 'ASC' }
    });
    res.json(boardDirectors);
  } catch (error) {
    console.error('Error fetching board directors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/board-directors/all - Get all board directors (admin route)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const boardDirectors = await boardDirectorRepository.find({
      order: { order: 'ASC' }
    });
    res.json(boardDirectors);
  } catch (error) {
    console.error('Error fetching all board directors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/board-directors/:id - Get single board director by ID
router.get('/:id', async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    const boardDirector = await boardDirectorRepository.findOne({ where: { id: req.params.id } });
    
    if (!boardDirector) {
      return res.status(404).json({ message: 'Board director not found' });
    }
    
    res.json(boardDirector);
  } catch (error) {
    console.error('Error fetching board director:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/board-directors - Create new board director (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    
    const newBoardDirector = boardDirectorRepository.create(req.body);
    const savedBoardDirector = await boardDirectorRepository.save(newBoardDirector);
    
    res.status(201).json(savedBoardDirector);
  } catch (error) {
    console.error('Error creating board director:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/board-directors/:id - Update board director (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    
    const boardDirector = await boardDirectorRepository.findOne({ where: { id: req.params.id } });
    if (!boardDirector) {
      return res.status(404).json({ message: 'Board director not found' });
    }
    
    await boardDirectorRepository.update(req.params.id, req.body);
    const updatedBoardDirector = await boardDirectorRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedBoardDirector);
  } catch (error) {
    console.error('Error updating board director:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/board-directors/:id - Delete board director (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const boardDirectorRepository = AppDataSource.getRepository(BoardDirector);
    
    const boardDirector = await boardDirectorRepository.findOne({ where: { id: req.params.id } });
    if (!boardDirector) {
      return res.status(404).json({ message: 'Board director not found' });
    }
    
    await boardDirectorRepository.delete(req.params.id);
    res.json({ message: 'Board director deleted successfully' });
  } catch (error) {
    console.error('Error deleting board director:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
