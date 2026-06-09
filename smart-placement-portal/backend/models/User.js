const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  password:   { type: String, required: true },
  role:       { type: String, enum: ['student', 'admin'], default: 'student' },
  branch:     { type: String },
  year:       { type: String },
  resumeUrl:  { type: String },
  skills:     [String],
  linkedin:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
