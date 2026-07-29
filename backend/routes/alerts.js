// routes/alerts.js
// GET /alerts -> returns heatwave warnings, most recent first

const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find()
      .sort({ date: -1, createdAt: -1 })
      .limit(50)
      .lean();

    // Normalize _id to id for frontend compatibility
    const normalized = alerts.map((a) => ({ ...a, id: a._id }));
    return res.json({ success: true, count: normalized.length, alerts: normalized });
  } catch (err) {
    console.error('Error in GET /alerts:', err.message);
    return res.status(500).json({ error: 'Could not fetch alerts.' });
  }
});

module.exports = router;
