// seed.js - MongoDB seed script
// Run once from the backend/ folder: node seed.js
// Make sure MONGODB_URI is set in backend/.env

require('dotenv').config();
const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/heatwave_db';

// ─── Inline Schemas (mirrors server/models) ─────────────────────────────────
const User = mongoose.model('User', new mongoose.Schema({
  username: String, password: String, role: String,
}, { timestamps: true }));

const WeatherData = mongoose.model('WeatherData', new mongoose.Schema({
  temperature: Number, humidity: Number, location: String, date: Date,
}, { timestamps: true }));

const Alert = mongoose.model('Alert', new mongoose.Schema({
  message: String, level: String, date: Date,
}, { timestamps: true }));

// ─── Helper ──────────────────────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), WeatherData.deleteMany(), Alert.deleteMany()]);
  console.log('🗑️  Cleared existing collections');

  // Seed user (admin / admin123)
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await User.create({ username: 'admin', password: hashedPassword, role: 'admin' });
  console.log('👤 Created admin user (admin / admin123)');

  // Seed weather data (last 7 days)
  await WeatherData.insertMany([
    { temperature: 32.5, humidity: 55, location: 'Mumbai', date: daysAgo(6) },
    { temperature: 34.0, humidity: 50, location: 'Mumbai', date: daysAgo(5) },
    { temperature: 36.2, humidity: 48, location: 'Mumbai', date: daysAgo(4) },
    { temperature: 38.7, humidity: 40, location: 'Mumbai', date: daysAgo(3) },
    { temperature: 41.5, humidity: 35, location: 'Mumbai', date: daysAgo(2) },
    { temperature: 43.2, humidity: 30, location: 'Mumbai', date: daysAgo(1) },
    { temperature: 39.0, humidity: 44, location: 'Mumbai', date: daysAgo(0) },
  ]);
  console.log('🌡️  Seeded 7 weather readings');

  // Seed alerts
  await Alert.insertMany([
    {
      message: 'Temperature reached 41.5°C - Heatwave conditions detected',
      level: 'High',
      date: daysAgo(2),
    },
    {
      message: 'Temperature reached 43.2°C - Severe heatwave conditions detected',
      level: 'Severe',
      date: daysAgo(1),
    },
  ]);
  console.log('🚨 Seeded 2 heatwave alerts');

  await mongoose.disconnect();
  console.log('🎉 Seeding complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
