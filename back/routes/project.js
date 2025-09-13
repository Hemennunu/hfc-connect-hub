const express = require('express');
const router = express.Router();
const Project = require('../models/project.js');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

// Get all projects (public)
router.get("/", async (req, res) => {
  try {
    const { status, category } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single project by ID (public)
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project (admin only)
router.post("/", auth, adminOnly, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');

    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Update project (admin only)
router.put("/:id", auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');

    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle project status (admin only)
router.patch("/:id/toggle-status", auth, adminOnly, async (req, res) => {
  try {
    console.log('Toggle status endpoint hit for project:', req.params.id);
    console.log('Request body:', req.body);
    console.log('User:', req.user);
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found:', req.params.id);
      return res.status(404).json({ message: "Project not found" });
    }

    console.log('Current project status:', project.status);
    
    // Toggle status
    const newStatus = project.status === 'ongoing' ? 'completed' : 'ongoing';
    console.log('New status will be:', newStatus);
    
    // Update fields based on new status
    if (newStatus === 'completed') {
      project.status = 'completed';
      project.completedDate = req.body.completedDate || new Date().toISOString().split('T')[0];
      if (req.body.impact) {
        project.impact = req.body.impact;
      }
    } else {
      project.status = 'ongoing';
      project.completedDate = undefined;
      project.impact = undefined;
    }

    await project.save();
    console.log('Project saved successfully with status:', project.status);

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');
    console.log('Socket event emitted: projectsUpdated');

    res.json(project);
  } catch (err) {
    console.error('Error in toggle status endpoint:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete project (admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
