const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const AppDataSource = require('../config/database');
const GalleryItem = require('../entities/GalleryItem');
const { auth, adminOnly } = require('../middleware/auth');
const { getIo } = require('../socket');

// Multer config for gallery items
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/gallery/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET /api/gallery - Get all published gallery items (public route)
router.get('/', async (req, res) => {
  try {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItems = await galleryRepository.find({
      where: { status: 'published' },
      order: { createdAt: 'DESC' }
    });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/gallery/all - Get all gallery items including unpublished (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItems = await galleryRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching all gallery items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/gallery/:id - Get single gallery item by ID
router.get('/:id', async (req, res) => {
  try {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItem = await galleryRepository.findOne({ where: { id: req.params.id } });
    
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    res.json(galleryItem);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/gallery - Create new gallery item (protected route)
router.post('/', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, description, category, location, dateTaken, tags, featured, status } = req.body;
    
    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }
    
    const mediaUrl = req.file ? `/uploads/gallery/${req.file.filename}` : null;
    const mediaType = req.file ? (req.file.mimetype.startsWith('video/') ? 'video' : 'image') : 'image';

    if (!mediaUrl) return res.status(400).json({ message: 'Media upload required', details: 'Please select an image or video file to upload' });

    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const newGalleryItem = galleryRepository.create({
      title,
      description,
      mediaUrl,
      mediaType,
      category,
      location,
      dateTaken: dateTaken ? new Date(dateTaken) : null,
      tags,
      featured: featured === 'true',
      status: status || 'published',
      createdBy: req.user.id
    });
    
    const savedGalleryItem = await galleryRepository.save(newGalleryItem);

    // Emit socket event for real-time updates
    const io = getIo();
    io.emit('galleryUpdated');
    
    res.status(201).json(savedGalleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/gallery/:id - Update gallery item (protected route)
router.put('/:id', auth, adminOnly, upload.single('media'), async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const galleryId = parseInt(req.params.id);
    
    if (isNaN(galleryId)) {
      return res.status(400).json({ message: 'Invalid gallery item ID' });
    }

    const { title, description, category, location, dateTaken, tags, featured, status } = req.body;
    const updateData = {
      title,
      description,
      category,
      location,
      dateTaken: dateTaken ? new Date(dateTaken) : null,
      tags,
      featured: featured === 'true',
      status: status || 'published'
    };

    // If new media uploaded, update media fields
    if (req.file) {
      updateData.mediaUrl = `/uploads/gallery/${req.file.filename}`;
      updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
    }

    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItem = await galleryRepository.findOne({ where: { id: galleryId } });
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    await galleryRepository.update(galleryId, updateData);
    const updatedGalleryItem = await galleryRepository.findOne({ where: { id: galleryId } });

    // Emit socket event for real-time updates
    const io = getIo();
    io.emit('galleryUpdated');
    
    res.json(updatedGalleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/gallery/:id - Delete gallery item (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const galleryId = parseInt(req.params.id);
    
    if (isNaN(galleryId)) {
      return res.status(400).json({ message: 'Invalid gallery item ID' });
    }

    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    
    const galleryItem = await galleryRepository.findOne({ where: { id: galleryId } });
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    
    await galleryRepository.delete(galleryId);

    // Emit socket event for real-time updates
    const io = getIo();
    io.emit('galleryUpdated');

    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/gallery/category/:category - Get gallery items by category
router.get('/category/:category', async (req, res) => {
  try {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItems = await galleryRepository.find({
      where: { 
        category: req.params.category,
        status: 'published'
      },
      order: { createdAt: 'DESC' }
    });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/gallery/featured - Get featured gallery items
router.get('/featured', async (req, res) => {
  try {
    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItems = await galleryRepository.find({
      where: { 
        featured: true,
        status: 'published'
      },
      order: { createdAt: 'DESC' }
    });
    res.json(galleryItems);
  } catch (error) {
    console.error('Error fetching featured gallery items:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
