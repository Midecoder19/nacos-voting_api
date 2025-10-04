// controllers/candidateController.js
const Candidate = require('../models/Candidate');

// Define your route handler functions
const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find();
    res.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Error fetching candidates' });
  }
};

// Export your route handler functions
module.exports = {
  getAllCandidates,
};
