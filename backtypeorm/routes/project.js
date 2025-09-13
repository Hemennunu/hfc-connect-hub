const express = require('express');
const router = express.Router();
const AppDataSource = require('../config/database');
const Project = require('../entities/Project');
const { getIo } = require('../socket');
const { auth, adminOnly } = require('../middleware/auth');

// Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const { status, category } = req.query;
    const projectRepository = AppDataSource.getRepository(Project);
    
    let whereCondition = {};
    if (status) whereCondition.status = status;
    if (category) whereCondition.category = category;
    
    const projects = await projectRepository.find({
      where: whereCondition,
      order: { createdAt: 'DESC' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single project by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create project (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { title, description, location, startDate, endDate, completedDate, beneficiaries, budget, impact, status, category } = req.body;
    
    // Validate required fields
    if (!title || !description || !location || !beneficiaries || !category) {
      return res.status(400).json({ message: 'Title, description, location, beneficiaries, and category are required' });
    }
    
    const projectRepository = AppDataSource.getRepository(Project);
    
    const projectData = {
      title,
      description,
      location,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      completedDate: completedDate ? new Date(completedDate) : null,
      beneficiaries,
      budget: budget || '',
      impact,
      status: status || 'ongoing',
      category,
      createdBy: req.user.id
    };
    
    const newProject = projectRepository.create(projectData);
    const savedProject = await projectRepository.save(newProject);

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');
    
    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update project (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const updateData = {
      ...req.body,
      startDate: req.body.startDate ? new Date(req.body.startDate) : project.startDate,
      endDate: req.body.endDate ? new Date(req.body.endDate) : project.endDate,
      completedDate: req.body.completedDate ? new Date(req.body.completedDate) : project.completedDate,
      budget: req.body.budget !== undefined ? req.body.budget : project.budget
    };
    
    await projectRepository.update(parseInt(req.params.id), updateData);
    const updatedProject = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');
    
    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle project status (admin only)
router.patch('/:id/toggle-status', auth, adminOnly, async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Toggle status
    const newStatus = project.status === 'ongoing' ? 'completed' : 'ongoing';
    
    const updateData = {
      status: newStatus
    };
    
    // Update fields based on new status
    if (newStatus === 'completed') {
      updateData.completedDate = req.body.completedDate ? new Date(req.body.completedDate) : new Date();
      if (req.body.impact) {
        updateData.impact = req.body.impact;
      }
    } else {
      updateData.completedDate = null;
      updateData.impact = null;
    }

    await projectRepository.update(parseInt(req.params.id), updateData);
    const updatedProject = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');

    res.json(updatedProject);
  } catch (error) {
    console.error('Error toggling project status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    
    const project = await projectRepository.findOne({ where: { id: parseInt(req.params.id) } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    await projectRepository.delete(parseInt(req.params.id));

    // Emit update event to clients
    const io = getIo();
    io.emit('projectsUpdated');

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all projects (admin route)
router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      order: { createdAt: 'DESC' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get featured projects
router.get('/featured', async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      where: { featured: true },
      order: { createdAt: 'DESC' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get projects by category
router.get('/category/:category', async (req, res) => {
  try {
    const projectRepository = AppDataSource.getRepository(Project);
    const projects = await projectRepository.find({
      where: { category: req.params.category },
      order: { createdAt: 'DESC' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects by category:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
