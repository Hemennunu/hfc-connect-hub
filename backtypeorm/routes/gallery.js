const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const AppDataSource = require('../config/database');
const GalleryItem = require('../entities/GalleryItem');
const { auth, adminOnly } = require('../middleware/auth');
const { getIo } = require('../socket');

// Ensure the upload directory exists
const uploadDir = path.join(__dirname, '../uploads/gallery');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

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
    console.log('Received request to create gallery item:');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Handle multipart/form-data
    if (req.headers['content-type']?.includes('multipart/form-data') && !req.body) {
      return res.status(400).json({ message: "Invalid form data" });
    }

    const { title, description, category, location, dateTaken, tags, featured, status } = req.body;
    
    // Validate required fields
    if (!title || !category) {
      return res.status(400).json({ message: 'Title and category are required' });
    }

    const allowedCategories = ['Child Development', 'Community Empowerment', 'HIV/AIDS Support', 'Social Accountability', 'Events', 'Training'];
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ message: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` });
    }
    
    const mediaUrl = req.file ? req.file.filename : null;
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

    const galleryRepository = AppDataSource.getRepository(GalleryItem);
    const galleryItem = await galleryRepository.findOne({ where: { id: galleryId } });
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) {
      const allowedCategories = ['Child Development', 'Community Empowerment', 'HIV/AIDS Support', 'Social Accountability', 'Events', 'Training'];
      if (!allowedCategories.includes(req.body.category)) {
        return res.status(400).json({ message: `Invalid category. Must be one of: ${allowedCategories.join(', ')}` });
      }
      updateData.category = req.body.category;
    }
    if (req.body.location) updateData.location = req.body.location;
    if (req.body.dateTaken) updateData.dateTaken = new Date(req.body.dateTaken);
    if (req.body.tags) {
      if (Array.isArray(req.body.tags)) {
        updateData.tags = req.body.tags.join(',');
      } else {
        updateData.tags = req.body.tags;
      }
    }
    if (req.body.featured !== undefined) updateData.featured = req.body.featured === 'true';
    if (req.body.status) updateData.status = req.body.status;

    // If new media uploaded, update media fields
    if (req.file) {
      updateData.mediaUrl = req.file.filename;
      updateData.mediaType = req.file.mimetype.startsWith('video/') ? 'video' : 'image';
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
