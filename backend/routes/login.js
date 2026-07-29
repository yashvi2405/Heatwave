// routes/login.js
// POST /login -> validates username/password against the users collection

const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ success: false, error: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Error in POST /login:', err.message);
    return res.status(500).json({ error: 'Something went wrong during login.' });
  }
});

module.exports = router;
