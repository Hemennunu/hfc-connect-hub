const express = require("express");
const router = express.Router();
const AppDataSource = require("../config/database");
const Staff = require("../entities/Staff");
const { getIo } = require("../socket"); // import getIo
const { auth, adminOnly } = require('../middleware/auth'); // Adjust path if needed

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const staffRepository = AppDataSource.getRepository(Staff);
    const newStaff = staffRepository.create(req.body);
    const savedStaff = await staffRepository.save(newStaff);

    // Get io instance and emit event
    const io = getIo();

    console.log("Broadcasting staffUpdated event");
    io.emit("staffUpdated");

    res.json(savedStaff);
  } catch (err) {
    console.error('Error creating staff member:', err);
    res.status(500).json({ message: "Failed to add staff member", error: err.message });
  }
});

// GET /api/staff/all - Get all staff members (admin route)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const staffRepository = AppDataSource.getRepository(Staff);
    const staff = await staffRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(staff);
  } catch (error) {
    console.error('Error fetching all staff:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/staff/:id - Get single staff member by ID
router.get('/:id', async (req, res) => {
  try {
    const staffRepository = AppDataSource.getRepository(Staff);
    const staff = await staffRepository.findOne({ where: { id: req.params.id } });
    
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    
    res.json(staff);
  } catch (error) {
    console.error('Error fetching staff member:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: Allow public access to staff data for frontend
router.get("/", async (req, res) => {
  try {
    const staffRepository = AppDataSource.getRepository(Staff);
    const staff = await staffRepository.find();  // Fetch all staff from MySQL
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to get staff list" });
  }
});

// SECURITY: Add PUT and DELETE routes with admin protection
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const staffId = parseInt(req.params.id);
    
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID' });
    }

    const staffRepository = AppDataSource.getRepository(Staff);
    const existingStaff = await staffRepository.findOne({ where: { id: staffId } });
    
    if (!existingStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    await staffRepository.update(staffId, req.body);
    const updatedStaff = await staffRepository.findOne({ where: { id: staffId } });
    
    const io = getIo();
    io.emit("staffUpdated");
    
    res.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff member:', error);
    res.status(500).json({ message: "Failed to update staff member", error: error.message });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    if (!AppDataSource.isInitialized) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const staffId = parseInt(req.params.id);
    
    if (isNaN(staffId)) {
      return res.status(400).json({ message: 'Invalid staff ID' });
    }

    const staffRepository = AppDataSource.getRepository(Staff);
    const existingStaff = await staffRepository.findOne({ where: { id: staffId } });
    
    if (!existingStaff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    await staffRepository.delete(staffId);
    
    const io = getIo();
    io.emit("staffUpdated");
    
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error('Error deleting staff member:', error);
    res.status(500).json({ message: "Failed to delete staff member", error: error.message });
  }
});

module.exports = router;
