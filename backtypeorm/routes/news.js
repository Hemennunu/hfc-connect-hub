const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const News = require('../entities/News');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/news - Get all news (public route)
router.get('/', async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected', data: [] });
    }
    
    const newsRepository = AppDataSource.getRepository(News);
    const news = await newsRepository.find({
      order: { date: 'DESC' }
    });
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/news/:id - Get single news by ID
router.get('/:id', async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const newsRepository = AppDataSource.getRepository(News);
    const news = await newsRepository.findOne({ 
      where: { id: req.params.id }
    });
    
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    res.json(news);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/news - Create new news (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const { title, type, content, eventDate, location, mediaUrl } = req.body;
    
    // Validate required fields
    if (!title || !type || !content) {
      return res.status(400).json({ message: 'Title, type, and content are required' });
    }
    
    const newsRepository = AppDataSource.getRepository(News);
    
    const newNews = newsRepository.create({
      title,
      type,
      content,
      eventDate: eventDate ? new Date(eventDate) : null,
      location,
      mediaUrl,
      createdBy: req.user ? req.user.id : null
    });
    
    const savedNews = await newsRepository.save(newNews);
    
    // Emit socket event if available
    if (req.io) {
      req.io.emit('newsCreated', savedNews);
    }
    
    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Error creating news:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/news/:id - Update news (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const newsRepository = AppDataSource.getRepository(News);
    
    const news = await newsRepository.findOne({ where: { id: req.params.id } });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    const { title, type, content, eventDate, location, mediaUrl } = req.body;
    const updateData = {
      title: title || news.title,
      type: type || news.type,
      content: content || news.content,
      eventDate: eventDate ? new Date(eventDate) : news.eventDate,
      location: location !== undefined ? location : news.location,
      mediaUrl: mediaUrl !== undefined ? mediaUrl : news.mediaUrl
    };
    
    await newsRepository.update(req.params.id, updateData);
    const updatedNews = await newsRepository.findOne({ 
      where: { id: req.params.id }
    });
    
    // Emit socket event if available
    if (req.io) {
      req.io.emit('newsUpdated', updatedNews);
    }
    
    res.json(updatedNews);
  } catch (error) {
    console.error('Error updating news:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/news/:id - Delete news (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }
    
    const newsRepository = AppDataSource.getRepository(News);
    
    const news = await newsRepository.findOne({ where: { id: req.params.id } });
    if (!news) {
      return res.status(404).json({ message: 'News not found' });
    }
    
    await newsRepository.delete(req.params.id);
    
    // Emit socket event if available
    if (req.io) {
      req.io.emit('newsDeleted', { id: req.params.id });
    }
    
    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Error deleting news:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
