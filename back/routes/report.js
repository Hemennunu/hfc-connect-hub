const express = require('express');
const multer = require('multer');
const path = require('path');
const Report = require('../models/Report');
const { auth, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Multer config for reports
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/reports/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get all reports (public)
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get report by ID
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new report (admin only)
router.post('/', auth, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, type, description, year, featured } = req.body;
    const fileUrl = req.file ? `/uploads/reports/${req.file.filename}` : null;
    const fileName = req.file ? req.file.originalname : null;
    const fileSize = req.file ? req.file.size : null;

    if (!fileUrl) return res.status(400).json({ message: 'File upload required' });

    const report = new Report({ 
      title, 
      type, 
      description,
      fileUrl,
      fileName,
      fileSize,
      year: year ? parseInt(year) : new Date().getFullYear(),
      featured: featured === 'true',
      createdBy: req.user.id
    });
    
    await report.save();

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportAdded', report);
    }

    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update report (admin only)
router.put('/:id', auth, adminOnly, upload.single('file'), async (req, res) => {
  try {
    const { title, type, description, year, featured } = req.body;
    const updateData = { 
      title, 
      type, 
      description,
      year: year ? parseInt(year) : undefined,
      featured: featured === 'true',
      updatedAt: new Date()
    };

    // If new file uploaded, update file fields
    if (req.file) {
      updateData.fileUrl = `/uploads/reports/${req.file.filename}`;
      updateData.fileName = req.file.originalname;
      updateData.fileSize = req.file.size;
    }

    const report = await Report.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportUpdated', report);
    }

    res.json(report);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete report (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const report = await Report.findByIdAndDelete(req.params.id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportDeleted', req.params.id);
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Download file and increment count
router.get('/:id/download', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { $inc: { downloadCount: 1 } }, 
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    const filePath = path.join(__dirname, '..', report.fileUrl);
    res.download(filePath, report.fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increment download count (for API calls)
router.post('/:id/download', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { $inc: { downloadCount: 1 } }, 
      { new: true }
    );
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json({ downloadCount: report.downloadCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
