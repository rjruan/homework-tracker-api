const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  name: String,
  picture: String,
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' }
  }
});


module.exports = mongoose.models.User || mongoose.model('User', userSchema);