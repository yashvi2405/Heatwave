// routes/data.js
// GET  /data -> returns recent weather readings (for charts / dashboard)
// POST /data -> manually add a weather reading

const express = require('express');
const router = express.Router();
const WeatherData = require('../models/WeatherData');

router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const rows = await WeatherData.find()
      .sort({ date: 1, createdAt: 1 })
      .limit(limit)
      .lean();

    const normalized = rows.map((r) => ({ ...r, id: r._id }));
    return res.json({ success: true, count: normalized.length, data: normalized });
  } catch (err) {
    console.error('Error in GET /data:', err.message);
    return res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, location } = req.body;
    if (temperature === undefined || isNaN(temperature)) {
      return res.status(400).json({ error: 'A valid numeric "temperature" is required.' });
    }

    const entry = new WeatherData({
      temperature: parseFloat(temperature),
      humidity:    humidity ? parseFloat(humidity) : 0,
      location:    location || 'Unknown',
    });
    const saved = await entry.save();
    return res.status(201).json({ success: true, data: { ...saved.toObject(), id: saved._id } });
  } catch (err) {
    console.error('Error in POST /data:', err.message);
    return res.status(500).json({ error: 'Could not save weather data.' });
  }
});

module.exports = router;
