const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const authService = require('../services/authService');

// Path to the users.json file
const usersFilePath = path.join(__dirname, '../data/users.json');

// Read users from the JSON file
const getUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users file:', error);
    return [];
  }
};

// Write users to the JSON file
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing users file:', error);
  }
};

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const decoded = authService.verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  req.userId = decoded.userId;
  next();
};

// Get user profile
router.get('/profile', verifyToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(user => user.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user data without password
    res.json({
      id: user.id,
      username: user.username,
      name: user.name,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { name } = req.body;
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    users[userIndex].name = name;
    
    // Save updated users
    saveUsers(users);
    
    // Return updated user data
    res.json({
      id: users[userIndex].id,
      username: users[userIndex].username,
      name: users[userIndex].name,
      createdAt: users[userIndex].createdAt
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Save quiz result
router.post('/quiz-result', verifyToken, (req, res) => {
  try {
    const { language, score } = req.body;
    const users = getUsers();
    const userIndex = users.findIndex(user => user.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize quizHistory if it doesn't exist
    if (!users[userIndex].quizHistory) {
      users[userIndex].quizHistory = [];
    }
    
    // Add quiz result to user's history
    users[userIndex].quizHistory.push({
      language,
      score,
      date: new Date().toISOString()
    });
    
    // Save updated users
    saveUsers(users);
    
    res.json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Save quiz result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz history
router.get('/quiz-history', verifyToken, (req, res) => {
  try {
    const users = getUsers();
    const user = users.find(user => user.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user's quiz history
    res.json(user.quizHistory || []);
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 