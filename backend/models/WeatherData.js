// models/WeatherData.js - Mongoose schema for temperature/humidity readings
const mongoose = require('mongoose');

const weatherDataSchema = new mongoose.Schema(
  {
    temperature: { type: Number, required: true },
    humidity:    { type: Number, default: 0 },
    location:    { type: String, default: 'Unknown', trim: true },
    date:        { type: Date,   default: () => new Date() },
  },
  { timestamps: true }
);

// Index on date for fast sorting/querying
weatherDataSchema.index({ date: 1 });

module.exports = mongoose.model('WeatherData', weatherDataSchema);
