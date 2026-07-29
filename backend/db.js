// db.js - MongoDB connection using Mongoose
// Reads MONGODB_URI from environment variables (see .env.example)

require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heatwave_db';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB database');
  })
  .catch((err) => {
    console.error('❌ Could not connect to MongoDB:', err.message);
  });

module.exports = mongoose;
