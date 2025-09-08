const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const Stats = require('../entities/Stats');
const { auth } = require('../middleware/auth');

// GET /api/stats - Get all stats (public route)
router.get('/', async (req, res) => {
  try {
    const statsRepository = AppDataSource.getRepository(Stats);
    const stats = await statsRepository.find({ order: { order: 'ASC' } });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stats/active - Get only active stats (public route)
router.get('/active', async (req, res) => {
  try {
    const statsRepository = AppDataSource.getRepository(Stats);
    const stats = await statsRepository.find({ 
      where: { isActive: true },
      order: { order: 'ASC' }
    });
    res.json(stats);
  } catch (error) {
    console.error('Error fetching active stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stats/:id - Get single stat by ID
router.get('/:id', async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const statId = parseInt(req.params.id);
    
    if (isNaN(statId)) {
      return res.status(400).json({ message: 'Invalid stat ID' });
    }

    const statsRepository = AppDataSource.getRepository(Stats);
    const stat = await statsRepository.findOne({ where: { id: statId } });
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
      icon = 'circle',
      color = 'blue',
      secondaryNumber,
      secondaryLabel,
      additionalNumbers,
      additionalLabel,
      order = 0, 
      isActive = true 
    } = req.body;

    // Validate required fields
    if (!number || !label) {
      return res.status(400).json({ message: 'Number and label are required' });
    }

    const statsRepository = AppDataSource.getRepository(Stats);

    // Check if order already exists for active stats
    if (isActive !== false) {
      const existingOrder = await statsRepository.findOne({ 
        where: { order, isActive: true } 
      });
      if (existingOrder) {
        return res.status(400).json({ message: 'Order already exists for an active stat' });
      }
    }

    const newStat = statsRepository.create({
      number,
      label,
      icon,
      color,
      secondaryNumber,
      secondaryLabel,
      additionalNumbers,
      additionalLabel,
      order: Number(order) || 0,
      isActive: isActive !== false
    });

    const savedStat = await statsRepository.save(newStat);
    res.status(201).json(savedStat);
  } catch (error) {
    console.error('Error creating stat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/stats/:id - Update stat (protected route)
router.put('/:id', auth, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const statId = parseInt(req.params.id);
    
    if (isNaN(statId)) {
      return res.status(400).json({ message: 'Invalid stat ID' });
    }

    const { 
      number, 
      label, 
      icon,
      color,
      secondaryNumber,
      secondaryLabel,
      additionalNumbers,
      additionalLabel,
      order,
      isActive 
    } = req.body;

    const statsRepository = AppDataSource.getRepository(Stats);

    // Check if stat exists
    const stat = await statsRepository.findOne({ where: { id: statId } });
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }

    // If order is being changed, check if new order is already taken
    if (order !== undefined && order !== stat.order) {
      const existingOrder = await statsRepository.findOne({ 
        where: { 
          order, 
          isActive: true
        } 
      });
      if (existingOrder) {
        return res.status(400).json({ message: 'Order already exists for an active stat' });
      }
    }

    // Update fields
    const updateData = {};
    if (number !== undefined) updateData.number = number;
    if (label !== undefined) updateData.label = label;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (secondaryNumber !== undefined) updateData.secondaryNumber = secondaryNumber;
    if (secondaryLabel !== undefined) updateData.secondaryLabel = secondaryLabel;
    if (additionalNumbers !== undefined) updateData.additionalNumbers = additionalNumbers;
    if (additionalLabel !== undefined) updateData.additionalLabel = additionalLabel;
    if (order !== undefined) updateData.order = Number(order);
    if (isActive !== undefined) updateData.isActive = isActive;
    
    await statsRepository.update(statId, updateData);
    const updatedStat = await statsRepository.findOne({ where: { id: statId } });
    
    res.json(updatedStat);
  } catch (error) {
    console.error('Error updating stat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/stats/:id - Delete stat (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const statId = parseInt(req.params.id);
    
    if (isNaN(statId)) {
      return res.status(400).json({ message: 'Invalid stat ID' });
    }

    const statsRepository = AppDataSource.getRepository(Stats);
    const stat = await statsRepository.findOne({ where: { id: statId } });
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    await statsRepository.delete(statId);
    res.json({ message: 'Stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting stat:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/stats/:id/toggle - Toggle active status (protected route)
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const statId = parseInt(req.params.id);
    
    if (isNaN(statId)) {
      return res.status(400).json({ message: 'Invalid stat ID' });
    }

    const statsRepository = AppDataSource.getRepository(Stats);
    const stat = await statsRepository.findOne({ where: { id: statId } });
    
    if (!stat) {
      return res.status(404).json({ message: 'Stat not found' });
    }
    
    // If activating, check if the new order is already taken
    if (!stat.isActive) {
      const existingOrder = await statsRepository.findOne({ 
        where: { 
          order: stat.order, 
          isActive: true,
          id: AppDataSource.getRepository(Stats).createQueryBuilder()
            .where('id != :id', { id: stat.id })
        }
      });
      
      if (existingOrder) {
        return res.status(400).json({ 
          message: 'Cannot activate: Another active stat already has this order number' 
        });
      }
    }
    
    await statsRepository.update(statId, { isActive: !stat.isActive });
    const updatedStat = await statsRepository.findOne({ where: { id: statId } });
    
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
    
    const statsRepository = AppDataSource.getRepository(Stats);
    
    // Update order for each stat
    for (let i = 0; i < statsOrder.length; i++) {
      await statsRepository.update(statsOrder[i], { order: i + 1 });
    }
    
    // Return the updated stats in the new order
    const updatedStats = await statsRepository.find({ order: { order: 'ASC' } });
    res.json(updatedStats);
  } catch (error) {
    console.error('Error reordering stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
