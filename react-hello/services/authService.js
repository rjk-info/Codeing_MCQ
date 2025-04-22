const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// Register a new user
const register = async (userData) => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    const existingUser = users.find(user => user.username === userData.username);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username: userData.username,
      password: hashedPassword,
      name: userData.name,
      createdAt: new Date().toISOString()
    };
    
    // Add user to the list
    users.push(newUser);
    saveUsers(users);
    
    // Create JWT token
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Return user data and token
    return {
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name
      }
    };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Login a user
const login = async (credentials) => {
  try {
    const users = getUsers();
    
    // Find user by username
    const user = users.find(user => user.username === credentials.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Return user data and token
    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role || 'user'
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Verify token
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

module.exports = {
  register,
  login,
  verifyToken
}; 