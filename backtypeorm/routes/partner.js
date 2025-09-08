const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const Partner = require('../entities/Partner');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/partners - Get all active partners (public route)
router.get('/', async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    const partners = await partnerRepository.find({
      where: { isActive: true },
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/partners/all - Get all partners including inactive (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    const partners = await partnerRepository.find({
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching all partners:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/partners/:id - Get single partner by ID
router.get('/:id', async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    const partner = await partnerRepository.findOne({ where: { id: req.params.id } });
    
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    res.json(partner);
  } catch (error) {
    console.error('Error fetching partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/partners - Create new partner (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    
    const newPartner = partnerRepository.create(req.body);
    const savedPartner = await partnerRepository.save(newPartner);
    
    res.status(201).json(savedPartner);
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/partners/:id - Update partner (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    
    const partner = await partnerRepository.findOne({ where: { id: req.params.id } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    await partnerRepository.update(req.params.id, req.body);
    const updatedPartner = await partnerRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedPartner);
  } catch (error) {
    console.error('Error updating partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/partners/:id - Delete partner (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    
    const partner = await partnerRepository.findOne({ where: { id: req.params.id } });
    if (!partner) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    
    await partnerRepository.delete(req.params.id);
    res.json({ message: 'Partner deleted successfully' });
  } catch (error) {
    console.error('Error deleting partner:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/partners/type/:type - Get partners by type
router.get('/type/:type', async (req, res) => {
  try {
    const partnerRepository = AppDataSource.getRepository(Partner);
    const partners = await partnerRepository.find({
      where: { 
        partnershipType: req.params.type,
        isActive: true
      },
      order: { order: 'ASC', createdAt: 'DESC' }
    });
    res.json(partners);
  } catch (error) {
    console.error('Error fetching partners by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
