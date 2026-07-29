// routes/predict.js
// POST /predict -> takes temperature/humidity, returns a heatwave prediction
// Also stores the reading in WeatherData and creates an Alert if needed.

const express     = require('express');
const router      = express.Router();
const WeatherData = require('../models/WeatherData');
const Alert       = require('../models/Alert');

const HEATWAVE_THRESHOLD = Number(process.env.HEATWAVE_THRESHOLD) || 40;

// Simple, rule-based prediction logic
function getPrediction(temperature, humidity) {
  let heatwave = false;
  let level    = 'Low';
  let message  = 'Conditions are normal. No heatwave expected.';

  if (temperature > HEATWAVE_THRESHOLD) {
    heatwave = true;
    if (temperature >= 45) {
      level   = 'Severe';
      message = `Severe heatwave alert! Temperature is ${temperature}°C, well above the ${HEATWAVE_THRESHOLD}°C threshold.`;
    } else if (temperature >= 42) {
      level   = 'High';
      message = `High heatwave risk. Temperature is ${temperature}°C, above the ${HEATWAVE_THRESHOLD}°C threshold.`;
    } else {
      level   = 'Moderate';
      message = `Heatwave detected. Temperature is ${temperature}°C, above the ${HEATWAVE_THRESHOLD}°C threshold.`;
    }
    if (humidity !== undefined && humidity < 30 && level !== 'Severe') {
      level    = 'High';
      message += ' Low humidity increases the risk further.';
    }
  } else if (temperature >= HEATWAVE_THRESHOLD - 5) {
    level   = 'Moderate';
    message = `Temperature is ${temperature}°C, approaching the heatwave threshold of ${HEATWAVE_THRESHOLD}°C. Stay alert.`;
  }

  return { heatwave, level, message };
}

router.post('/', async (req, res) => {
  try {
    const { temperature, humidity, location } = req.body;

    if (temperature === undefined || temperature === null || isNaN(temperature)) {
      return res.status(400).json({ error: 'A valid numeric "temperature" is required.' });
    }

    const temp = parseFloat(temperature);
    const hum  = humidity !== undefined && humidity !== '' ? parseFloat(humidity) : null;
    const loc  = location && location.trim() !== '' ? location.trim() : 'Unknown';

    const prediction = getPrediction(temp, hum);

    // Store reading in MongoDB
    await new WeatherData({ temperature: temp, humidity: hum ?? 0, location: loc }).save();

    // Log alert if heatwave detected
    if (prediction.heatwave) {
      await new Alert({ message: prediction.message, level: prediction.level }).save();
    }

    return res.json({
      success: true,
      input: { temperature: temp, humidity: hum, location: loc },
      prediction,
    });
  } catch (err) {
    console.error('Error in POST /predict:', err.message);
    return res.status(500).json({ error: 'Something went wrong while generating the prediction.' });
  }
});

module.exports = router;
