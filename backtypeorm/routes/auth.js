const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AppDataSource = require('../config/database');
const User = require('../entities/User');
const router = express.Router();

// Register (signup) route - PUBLIC ACCESS
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    const newUser = userRepository.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'user' // Default role for public registration
    });
    
    const savedUser = await userRepository.save(newUser);
    
    // Create JWT token
    const payload = {
      user: {
        id: savedUser.id,
        role: savedUser.role
      }
    };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token,
        user: {
          id: savedUser.id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role
        }
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // SECURITY: Only allow admin users to login
    if(user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    const payload = { user: { id: user.id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// ADMIN MANAGEMENT: Allow admins to create other admin accounts
const { auth, adminOnly } = require('../middleware/auth');

router.post('/create-admin', auth, adminOnly, async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if(existingUser) return res.status(400).json({ msg: 'User already exists' });

    // Validate input
    if(!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    if(password.length < 8) {
      return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }

    // Hash password and create admin user
    const hashed = await bcrypt.hash(password, 12);
    const newUser = userRepository.create({
      name, 
      email, 
      password: hashed, 
      role: 'admin' // Force admin role
    });
    
    const savedUser = await userRepository.save(newUser);

    res.json({ 
      msg: 'Admin user created successfully',
      admin: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role,
        createdAt: savedUser.createdAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ADMIN MANAGEMENT: Get all admin users
router.get('/admins', auth, adminOnly, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const admins = await userRepository.find({ 
      where: { role: 'admin' },
      select: ['id', 'name', 'email', 'role', 'createdAt', 'updatedAt']
    });
    res.json(admins);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// ADMIN MANAGEMENT: Delete admin user (except self)
router.delete('/admin/:id', auth, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    
    // Prevent self-deletion
    if(req.user.id == id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    const existingUser = await userRepository.findOne({ where: { id } });
    if(!existingUser) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    await userRepository.delete(id);
    res.json({ msg: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
