const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');
const { auth, adminOnly } = require('../middleware/auth');

// Multer setup for resume uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume_${req.user.id}_${Date.now()}${ext}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// POST /api/applications/apply  (student applies to a job)
router.post('/apply', auth, upload.single('resume'), async (req, res) => {
  try {
    const { jobId, coverNote, expectedCtc } = req.body;
    const resumeUrl = req.file ? `/uploads/${req.file.filename}` : req.body.resumeUrl;

    const existing = await Application.findOne({ job: jobId, student: req.user.id });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const app = new Application({
      job: jobId,
      student: req.user.id,
      coverNote,
      expectedCtc,
      resumeUrl,
    });
    await app.save();
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/mine  (student sees their own applications)
router.get('/mine', auth, async (req, res) => {
  try {
    const apps = await Application.find({ student: req.user.id })
      .populate('job', 'title company location type ctc')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications  (admin sees all applications)
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const apps = await Application.find()
      .populate('job', 'title company')
      .populate('student', 'name email branch year')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/job/:jobId  (admin sees applicants for one job)
router.get('/job/:jobId', auth, adminOnly, async (req, res) => {
  try {
    const apps = await Application.find({ job: req.params.jobId })
      .populate('student', 'name email branch year skills linkedin')
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/applications/:id/status  (admin updates status)
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('job', 'title company').populate('student', 'name email');
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
