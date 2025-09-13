const express = require('express');
const router = express.Router();
const Stats = require('../models/Stats');
const { auth } = require('../middleware/auth');

// GET /api/stats - Get all stats (public route)
router.get('/', async (req, res) => {
  try {
    const stats = await Stats.find().sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stats/active - Get only active stats (public route)
router.get('/active', async (req, res) => {
  try {
    const stats = await Stats.find({ isActive: true }).sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching active stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stats/:id - Get single stat by ID
router.get('/:id', async (req, res) => {
  try {
    const stat = await Stats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    res.json(stat);
  } catch (error) {
    console.error('Error fetching stat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stats - Create new stat (protected route)
router.post('/', auth, async (req, res) => {
  try {
    const { 
      number, 
      label, 
      order = 0, 
      isActive = true 
    } = req.body;

    // Validate required fields
    if (!number || !label) {
      return res.status(400).json({ message: 'Number and label are required' });
    }

    // Check if order already exists for active stats
    if (isActive !== false) {
      const existingOrder = await Stats.findOne({ order, isActive: true });
      if (existingOrder) {
        return res.status(400).json({ message: 'Order already exists for an active stat' });
      }
    }

    const newStat = new Stats({
      number,
      label,
      order: Number(order) || 0,
      isActive: isActive !== false
    });

    const savedStat = await newStat.save();
    res.status(201).json(savedStat);
  } catch (error) {
    console.error('Error creating stat:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Order already exists for an active stat' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/stats/:id - Update stat (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    const { 
      number, 
      label, 
      order,
      isActive 
    } = req.body;

    // Check if stat exists
    let stat = await Stats.findById(req.params.id);
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }

    // If order is being changed, check if new order is already taken
    if (order !== undefined && order !== stat.order) {
      const existingOrder = await Stats.findOne({ 
        order, 
        isActive: true, 
        _id: { $ne: req.params.id } 
      });
      if (existingOrder) {
        return res.status(400).json({ message: 'Order already exists for an active stat' });
      }
    }

    // Update fields if they exist in request
    if (number !== undefined) stat.number = number;
    if (label !== undefined) stat.label = label;
    if (order !== undefined) stat.order = Number(order);
    if (isActive !== undefined) stat.isActive = isActive;
    
    stat.updatedAt = Date.now();
    
    const updatedStat = await stat.save();
    res.json(updatedStat);
  } catch (error) {
    console.error('Error updating stat:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Order already exists for an active stat' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/stats/:id - Delete stat (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedStat = await Stats.findByIdAndDelete(req.params.id);
    
    if (!deletedStat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting stat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/stats/:id/toggle - Toggle active status (protected route)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const stat = await Stats.findById(req.params.id);
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    // If activating, check if the new order is already taken
    if (!stat.isActive) {
      const existingOrder = await Stats.findOne({ 
        order: stat.order, 
        isActive: true,
        _id: { $ne: stat._id }
      });
      
      if (existingOrder) {
        return res.status(400).json({ 
          message: 'Cannot activate: Another active stat already has this order number' 
        });
      }
    }
    
    stat.isActive = !stat.isActive;
    stat.updatedAt = Date.now();
    
    const updatedStat = await stat.save();
    res.json(updatedStat);
  } catch (error) {
    console.error('Error toggling stat status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stats/reorder - Reorder stats (protected route)
router.post('/reorder', auth, async (req, res) => {
  try {
    const { stats: statsOrder } = req.body;
    
    if (!Array.isArray(statsOrder)) {
      return res.status(400).json({ message: 'Invalid stats order data' });
    }
    
    // Update order for each stat
    const bulkOps = statsOrder.map((statId, index) => ({
      updateOne: {
        filter: { _id: statId },
        update: { $set: { order: index + 1 } }
      }
    }));
    
    await Stats.bulkWrite(bulkOps);
    
    // Return the updated stats in the new order
    const updatedStats = await Stats.find().sort({ order: 1 });
    res.json(updatedStats);
  } catch (error) {
    console.error('Error reordering stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
