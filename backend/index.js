// index.js - Main Express server for the Heatwave Monitoring System

require('dotenv').config();
require('./db'); // Connect to MongoDB
const express = require('express');
const cors = require('cors');


const predictRoute = require('./routes/predict');
const dataRoute = require('./routes/data');
const alertsRoute = require('./routes/alerts');
const loginRoute = require('./routes/login');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check / root route
app.get('/', (req, res) => {
  res.json({ message: 'Heatwave Monitoring System API is running 🌡️' });
});

// API routes
app.use('/predict', predictRoute);
app.use('/data', dataRoute);
app.use('/alerts', alertsRoute);
app.use('/login', loginRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

// Generic error handler (catches unexpected errors)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
