const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const Donation = require('../entities/Donation');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/donations - Get all donations (admin only)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const donationRepository = AppDataSource.getRepository(Donation);
    const donations = await donationRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/donations/:id - Get single donation by ID (admin only)
router.get('/:id', auth, adminOnly, async (req, res) => {
  try {
    const donationRepository = AppDataSource.getRepository(Donation);
    const donation = await donationRepository.findOne({ where: { id: req.params.id } });
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.json(donation);
  } catch (error) {
    console.error('Error fetching donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/donations - Create new donation (public route)
router.post('/', async (req, res) => {
  try {
    const { donorName, email, amount, donationType, message } = req.body;
    
    // Validate required fields
    if (!donorName || !email || !amount || !donationType) {
      return res.status(400).json({ message: 'Donor name, email, amount, and donation type are required' });
    }
    
    const donationRepository = AppDataSource.getRepository(Donation);
    
    const donationData = {
      donorName,
      email,
      amount: parseFloat(amount) || 0,
      donationType,
      message,
      status: 'pending'
    };
    
    const newDonation = donationRepository.create(donationData);
    const savedDonation = await donationRepository.save(newDonation);
    
    res.status(201).json(savedDonation);
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/donations/:id - Update donation (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const donationRepository = AppDataSource.getRepository(Donation);
    
    const donation = await donationRepository.findOne({ where: { id: req.params.id } });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    const updateData = {
      ...req.body,
      amount: req.body.amount ? parseFloat(req.body.amount) : donation.amount
    };
    
    await donationRepository.update(req.params.id, updateData);
    const updatedDonation = await donationRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedDonation);
  } catch (error) {
    console.error('Error updating donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/donations/:id - Delete donation (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const donationRepository = AppDataSource.getRepository(Donation);
    
    const donation = await donationRepository.findOne({ where: { id: req.params.id } });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    await donationRepository.delete(req.params.id);
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/donations/stats/summary - Get donation statistics (admin only)
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  try {
    const donationRepository = AppDataSource.getRepository(Donation);
    
    const totalDonations = await donationRepository.count();
    const completedDonations = await donationRepository.count({ where: { status: 'completed' } });
    const pendingDonations = await donationRepository.count({ where: { status: 'pending' } });
    
    const totalAmountResult = await donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.status = :status', { status: 'completed' })
      .getRawOne();
    
    const totalAmount = parseFloat(totalAmountResult.total) || 0;
    
    res.json({
      totalDonations,
      completedDonations,
      pendingDonations,
      totalAmount
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
