const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, name } = req.body;
    
    // Register user using our local service
    const result = await authService.register({ username, password, name });
    
    // Return user data and token
    res.status(201).json(result);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ message: error.message || 'Server error during registration' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Login user using our local service
    const result = await authService.login({ username, password });
    
    // Return user data and token
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message || 'Server error during login' });
  }
});

module.exports = router; 