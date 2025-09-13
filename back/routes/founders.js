const express = require('express');
const { auth, adminOnly } = require('../middleware/auth');
const FounderProfile = require('../models/FounderProfile');
const router = express.Router();

router.get('/', async (req,res) => {
  try {
    const list = await FounderProfile.find();
    res.json(list);
  } catch {
    res.status(500).send('Error fetching');
  }
});

router.post('/', auth, adminOnly, async (req,res) => {
  try {
    const item = new FounderProfile(req.body);
    await item.save();
    res.json(item);
  } catch {
    res.status(500).send('Error creating');
  }
});

router.put('/:id', auth, adminOnly, async(req,res) => {
  try {
    const item = await FounderProfile.findByIdAndUpdate(req.params.id, req.body, {new:true});
    res.json(item);
  } catch {
    res.status(500).send('Error updating');
  }
});

router.delete('/:id', auth, adminOnly, async(req,res) => {
  try {
    await FounderProfile.findByIdAndDelete(req.params.id);
    res.json({msg:'Deleted'});
  } catch {
    res.status(500).send('Error deleting');
  }
});

module.exports = router;
