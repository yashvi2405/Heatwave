// models/User.js - Mongoose schema for admin/user accounts
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, maxlength: 50 },
    password: { type: String, required: true },        // bcrypt hashed
    role:     { type: String, default: 'user', enum: ['admin', 'user'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
