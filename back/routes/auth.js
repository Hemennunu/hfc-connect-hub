const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendWelcomeEmail } = require('../utils/emailService');
const router = express.Router();

// Register (signup) route - PUBLIC ACCESS
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: 'user' // Default role for public registration
    });
    
    await user.save();
    
    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log(`Welcome email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails
    }
    
    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };
    
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }, (err, token) => {
      if (err) throw err;
      res.json({ 
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
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
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // SECURITY: Only allow admin users to login
    if(user.role !== 'admin') {
      return res.status(403).json({ msg: 'Access denied. Admin privileges required.' });
    }

    const payload = { user: { id: user._id, role: user.role } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' }); // Reduced token lifetime

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
    // Check if user already exists
    let user = await User.findOne({ email });
    if(user) return res.status(400).json({ msg: 'User already exists' });

    // Validate input
    if(!name || !email || !password) {
      return res.status(400).json({ msg: 'Name, email, and password are required' });
    }

    if(password.length < 8) {
      return res.status(400).json({ msg: 'Password must be at least 8 characters long' });
    }

    // Hash password and create admin user
    const hashed = await bcrypt.hash(password, 12);
    user = new User({
      name, 
      email, 
      password: hashed, 
      role: 'admin' // Force admin role
    });
    await user.save();

    res.json({ 
      msg: 'Admin user created successfully',
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
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
    const admins = await User.find({ role: 'admin' }).select('-password');
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
    
    // Prevent self-deletion
    if(req.user.id === id) {
      return res.status(400).json({ msg: 'Cannot delete your own account' });
    }

    const deletedAdmin = await User.findByIdAndDelete(id);
    if(!deletedAdmin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }

    res.json({ msg: 'Admin deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
