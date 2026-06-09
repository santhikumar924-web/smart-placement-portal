const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const { auth, adminOnly } = require('../middleware/auth');

// GET /api/jobs  (public - all active jobs)
router.get('/', async (req, res) => {
  try {
    const { search, type, domain } = req.query;
    const filter = { isActive: true };

    if (type) filter.type = type;
    if (domain) filter.domain = domain;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs  (admin only)
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/jobs/:id  (admin only)
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id  (admin only - soft delete)
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Job removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
