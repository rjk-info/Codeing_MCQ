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

// Get quiz questions
router.get('/questions', (req, res) => {
  try {
    // This is a placeholder. In a real app, you would fetch questions from a database
    const questions = [
      {
        id: 1,
        question: 'What is JavaScript?',
        options: [
          { id: 'a', text: 'A programming language', isCorrect: true },
          { id: 'b', text: 'A markup language', isCorrect: false },
          { id: 'c', text: 'A styling language', isCorrect: false },
          { id: 'd', text: 'A database', isCorrect: false }
        ]
      },
      {
        id: 2,
        question: 'What is React?',
        options: [
          { id: 'a', text: 'A database', isCorrect: false },
          { id: 'b', text: 'A programming language', isCorrect: false },
          { id: 'c', text: 'A JavaScript library for building user interfaces', isCorrect: true },
          { id: 'd', text: 'A styling framework', isCorrect: false }
        ]
      },
      {
        id: 3,
        question: 'What is MongoDB?',
        options: [
          { id: 'a', text: 'A programming language', isCorrect: false },
          { id: 'b', text: 'A NoSQL database', isCorrect: true },
          { id: 'c', text: 'A styling framework', isCorrect: false },
          { id: 'd', text: 'A JavaScript library', isCorrect: false }
        ]
      }
    ];
    
    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit quiz answer
router.post('/submit', verifyToken, (req, res) => {
  try {
    const { language, score, totalQuestions } = req.body;
    
    // Get users
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
      totalQuestions,
      date: new Date().toISOString()
    });
    
    // Save updated users
    saveUsers(users);
    
    res.json({ message: 'Quiz result saved successfully' });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get quiz results
router.get('/results', verifyToken, (req, res) => {
  try {
    // Get users
    const users = getUsers();
    const user = users.find(user => user.id === req.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return user's quiz history
    res.json(user.quizHistory || []);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 