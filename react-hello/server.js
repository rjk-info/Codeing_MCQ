const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Store analytics data in memory (you might want to use a database in production)
const analytics = {
  totalVisits: 0,
  uniqueVisitors: new Set(),
  dailyVisits: {},
  lastVisits: []
};

// Middleware
app.use(cors());
app.use(express.json());

// Analytics middleware
app.use((req, res, next) => {
  // Increment total visits
  analytics.totalVisits++;
  
  // Track unique visitors using IP
  const visitorIP = req.ip;
  analytics.uniqueVisitors.add(visitorIP);
  
  // Track daily visits
  const today = new Date().toISOString().split('T')[0];
  analytics.dailyVisits[today] = (analytics.dailyVisits[today] || 0) + 1;
  
  // Track recent visits
  analytics.lastVisits.unshift({
    timestamp: new Date(),
    path: req.path,
    ip: visitorIP
  });
  
  // Keep only last 100 visits
  if (analytics.lastVisits.length > 100) {
    analytics.lastVisits.pop();
  }
  
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/quiz', require('./routes/quiz'));

// Analytics endpoints
app.get('/api/analytics', async (req, res) => {
  try {
    const stats = {
      totalVisits: analytics.totalVisits,
      uniqueVisitors: analytics.uniqueVisitors.size,
      dailyVisits: analytics.dailyVisits,
      lastVisits: analytics.lastVisits.slice(0, 10) // Return only last 10 visits
    };
    res.json(stats);
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Error fetching analytics' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, 'build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 