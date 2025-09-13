// backend/routes/gallery.js
const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

// POST: Create new gallery item (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const newGalleryItem = new GalleryItem(req.body);
    await newGalleryItem.save();

    // Emit update event to clients
    const io = getIo();
    io.emit('galleryUpdated');

    res.json(newGalleryItem);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add gallery item');
  }
});

// PUBLIC: Get all gallery items for frontend
router.get('/', async (req, res) => {
  try {
    const galleryItems = await GalleryItem.find().sort({ date: -1 });
    res.json(galleryItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve gallery items' });
  }
});

// PUT: Update gallery item (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const updatedGalleryItem = await GalleryItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedGalleryItem) return res.status(404).json({ error: 'Gallery item not found' });
    
    const io = getIo();
    io.emit('galleryUpdated');
    
    res.json(updatedGalleryItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update gallery item' });
  }
});

// DELETE: Delete gallery item (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const deletedGalleryItem = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!deletedGalleryItem) return res.status(404).json({ error: 'Gallery item not found' });
    
    const io = getIo();
    io.emit('galleryUpdated');
    
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});

module.exports = router;
