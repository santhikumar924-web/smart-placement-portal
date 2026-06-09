const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  job:       { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status:    { type: String, enum: ['Applied', 'Under Review', 'Shortlisted', 'Accepted', 'Rejected'], default: 'Applied' },
  coverNote: { type: String },
  resumeUrl: { type: String },
  expectedCtc: { type: String },
}, { timestamps: true });

// One application per student per job
ApplicationSchema.index({ job: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Application', ApplicationSchema);
