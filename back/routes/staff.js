const express = require("express");
const router = express.Router();
const Staff = require("../models/Staff");
const { getIo } = require("../socket"); // import getIo
const { auth, adminOnly } = require('../middleware/auth'); // Adjust path if needed

router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();

    // Get io instance and emit event
    const io = getIo();

console.log("Broadcasting staffUpdated event");
io.emit("staffUpdated");


    res.json(newStaff);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to add staff member");
  }
});
// PUBLIC: Allow public access to staff data for frontend
router.get("/", async (req, res) => {
  try {
    const staff = await Staff.find();  // Fetch all staff from MongoDB
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: "Failed to get staff list" });
  }
});

// SECURITY: Add PUT and DELETE routes with admin protection
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStaff) return res.status(404).json({ error: "Staff member not found" });
    
    const io = getIo();
    io.emit("staffUpdated");
    
    res.json(updatedStaff);
  } catch (error) {
    res.status(500).json({ error: "Failed to update staff member" });
  }
});

router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) return res.status(404).json({ error: "Staff member not found" });
    
    const io = getIo();
    io.emit("staffUpdated");
    
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete staff member" });
  }
});

module.exports = router;
