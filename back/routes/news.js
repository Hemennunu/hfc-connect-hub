// backend/routes/news.js
const express = require('express');
const router = express.Router();
const News = require('../models/News');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const newNews = new News(req.body);
    await newNews.save();

    // Emit update event to clients
    const io = getIo();
    io.emit('newsUpdated');

    res.json(newNews);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add news');
  }
});

// PUBLIC: Allow public access to news data for frontend
router.get('/', async (req, res) => {
  try {
    const newsItems = await News.find().sort({ date: -1 });
    res.json(newsItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve news' });
  }
});

// SECURITY: Add PUT and DELETE routes with admin protection
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const updatedNews = await News.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedNews) return res.status(404).json({ error: 'News article not found' });
    
    const io = getIo();
    io.emit('newsUpdated');
    
    res.json(updatedNews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update news article' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedNews = await News.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ error: 'News article not found' });
    
    const io = getIo();
    io.emit('newsUpdated');
    
    res.json({ message: 'News article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete news article' });
  }
});

module.exports = router;
