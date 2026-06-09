const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  company:     { type: String, required: true },
  location:    { type: String, required: true },
  type:        { type: String, enum: ['Internship', 'Full-time'], required: true },
  domain:      { type: String, required: true },
  ctc:         { type: String },
  description: { type: String },
  skills:      [String],
  deadline:    { type: Date },
  isActive:    { type: Boolean, default: true },
  postedBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
