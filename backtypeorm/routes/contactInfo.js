const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const Contact = require('../entities/Contact');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/contact - Get contact information (public route)
router.get('/', async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);
    const contacts = await contactRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/contact/:id - Get single contact by ID
router.get('/:id', async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);
    const contact = await contactRepository.findOne({ where: { id: req.params.id } });
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/contact - Create new contact (protected route)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);
    
    const newContact = contactRepository.create(req.body);
    const savedContact = await contactRepository.save(newContact);
    
    res.status(201).json(savedContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/contact/:id - Update contact (protected route)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);
    
    const contact = await contactRepository.findOne({ where: { id: req.params.id } });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await contactRepository.update(req.params.id, req.body);
    const updatedContact = await contactRepository.findOne({ where: { id: req.params.id } });
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/contact/:id - Delete contact (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(Contact);
    
    const contact = await contactRepository.findOne({ where: { id: req.params.id } });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    await contactRepository.delete(req.params.id);
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
