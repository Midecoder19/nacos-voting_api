// routes/dashboardRoutes.js
const express = require('express');
const Candidate = require('../models/Candidate');
const router = express.Router();

router.get('/dashboard', async (req, res) => {
  try {
    const positions = [
      'Vice President', 'President', 'General Secretary', 'Assistant General Secretary',
      'Treasurer', 'Financial Secretary', 'Auditor', 'Software director 1', 'Social director 1',
      'Sport director 1', 'Welfare Director 1', 'Public Relation Officer (PRO) 1',
      'Public Relation Officer (PRO) 2', 'Assistance Software director', 'Assistance Social director',
      'Assistance Sport director', 'Assistance Welfare Director'
    ];

    const dashboardData = {};
    
    for (const position of positions) {
      dashboardData[position] = await Candidate.find({ position }).sort({ votes: -1 }).lean();
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;
