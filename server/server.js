require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { db } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*', // Allows requests from React dev server on any port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON request bodies
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Root API Health & Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Authentication API',
    database: 'SQLite 3 (Connected)'
  });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.'
  });
});

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found.`
  });
});

// Start listening
const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Auth Server running on http://localhost:${PORT}`);
  console.log(`📁 Database: SQLite3 (auth.db)`);
  console.log(`🔒 Authentication: JWT + bcryptjs`);
  console.log(`===============================================`);
});

module.exports = app;
