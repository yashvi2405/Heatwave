// models/Alert.js - Mongoose schema for heatwave alerts
const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    level:   { type: String, required: true, enum: ['Low', 'Moderate', 'High', 'Severe'] },
    date:    { type: Date,   default: () => new Date() },
  },
  { timestamps: true }
);

// Index on date for fast sorting
alertSchema.index({ date: -1 });

module.exports = mongoose.model('Alert', alertSchema);
