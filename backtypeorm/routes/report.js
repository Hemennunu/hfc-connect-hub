const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const AppDataSource = require('../config/database');
const Report = require('../entities/Report');
const { auth, adminOnly } = require('../middleware/auth');

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

// GET /api/reports - Get all reports (public route)
router.get('/', async (req, res) => {
  try {
    const reportRepository = AppDataSource.getRepository(Report);
    const reports = await reportRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reports/all - Get all reports including unpublished (admin only)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const reportRepository = AppDataSource.getRepository(Report);
    const reports = await reportRepository.find({
      order: { year: 'DESC', createdAt: 'DESC' }
    });
    res.json(reports);
  } catch (error) {
    console.error('Error fetching all reports:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/reports/:id - Get single report by ID
router.get('/:id', async (req, res) => {
  try {
    const reportRepository = AppDataSource.getRepository(Report);
    const report = await reportRepository.findOne({ where: { id: req.params.id } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Increment download count
    await reportRepository.update(req.params.id, { 
      downloadCount: report.downloadCount + 1 
    });
    
    res.json(report);
  } catch (error) {
    console.error('Error fetching report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/reports - Create new report (protected route)
router.post('/', auth, adminOnly, upload.any(), async (req, res) => {
  try {
    const { title, type, description, year, featured } = req.body;
    // Normalize possible file field names: 'file', 'document', etc.
    let uploadedFile = null;
    if (req.file) {
      uploadedFile = req.file;
    } else if (Array.isArray(req.files) && req.files.length > 0) {
      // Prefer a file with expected field names if present
      uploadedFile = req.files.find(f => ['file','document','report','upload'].includes(f.fieldname)) || req.files[0];
    }
    const fileUrl = uploadedFile ? `/uploads/reports/${uploadedFile.filename}` : null;
    const fileName = uploadedFile ? uploadedFile.originalname : null;
    const fileSize = uploadedFile ? uploadedFile.size : null;

    // Validate required fields
    if (!title || !type || !description) {
      return res.status(400).json({ message: 'Title, type, and description are required' });
    }

    const reportRepository = AppDataSource.getRepository(Report);
    const newReport = reportRepository.create({
      title,
      type,
      description,
      fileUrl,
      fileName,
      fileSize,
      year: year ? parseInt(year) : new Date().getFullYear(),
      featured: (typeof featured === 'string') ? featured === 'true' : !!featured,
      createdBy: req.user.id
    });
    
    const savedReport = await reportRepository.save(newReport);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportAdded', savedReport);
    }

    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/reports/:id - Update report (protected route)
router.put('/:id', auth, adminOnly, upload.any(), async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { title, type, description, year, featured } = req.body;
    const reportId = parseInt(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }
    
    const reportRepository = AppDataSource.getRepository(Report);
    const report = await reportRepository.findOne({ where: { id: reportId } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Handle file update
    let uploadedFile = null;
    if (req.file) {
      uploadedFile = req.file;
    } else if (Array.isArray(req.files) && req.files.length > 0) {
      uploadedFile = req.files.find(f => ['file','document','report','upload'].includes(f.fieldname)) || req.files[0];
    }

    const updateData = {
      title: title || report.title,
      type: type || report.type,
      description: description || report.description,
      year: year ? parseInt(year) : report.year,
      featured: (typeof featured === 'string') ? featured === 'true' : (featured !== undefined ? !!featured : report.featured)
    };

    // Update file fields if new file uploaded
    if (uploadedFile) {
      updateData.fileUrl = `/uploads/reports/${uploadedFile.filename}`;
      updateData.fileName = uploadedFile.originalname;
      updateData.fileSize = uploadedFile.size;
    }

    await reportRepository.update(reportId, updateData);
    const updatedReport = await reportRepository.findOne({ where: { id: reportId } });

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportUpdated', updatedReport);
    }

    res.json(updatedReport);
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/reports/:id - Delete report (protected route)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const reportId = parseInt(req.params.id);
    
    if (isNaN(reportId)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const reportRepository = AppDataSource.getRepository(Report);
    
    const report = await reportRepository.findOne({ where: { id: reportId } });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    await reportRepository.delete(reportId);

    // Emit socket event for real-time updates
    if (req.io) {
      req.io.emit('reportDeleted', { id: reportId });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/reports/download/:id - Download report file
router.get('/download/:id', async (req, res) => {
  try {
    const reportRepository = AppDataSource.getRepository(Report);
    const report = await reportRepository.findOne({ where: { id: req.params.id } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Increment download count
    await reportRepository.update(req.params.id, { 
      downloadCount: report.downloadCount + 1 
    });

    // Send file for download
    const filePath = path.join(__dirname, '..', report.fileUrl);
    res.download(filePath, report.fileName);
  } catch (error) {
    console.error('Error downloading report:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
