const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');

// 🗳️ POST: Cast a vote for a candidate
router.post('/vote/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Increment vote count
    const candidate = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!candidate) {
      return res.status(404).json({ success: false, message: 'Candidate not found' });
    }

    res.status(200).json({
      success: true,
      message: '✅ Vote recorded successfully',
      candidate: {
        id: candidate._id,
        name: candidate.name,
        position: candidate.position,
        votes: candidate.votes,
        photoUrl: candidate.photoUrl || "https://via.placeholder.com/150" // fallback
      }
    });
  } catch (error) {
    console.error('❌ Error recording vote:', error);
    res.status(500).json({ success: false, message: 'Server error while recording vote' });
  }
});

// 👥 GET: Fetch all candidates grouped by position
router.get('/candidates/all', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1 });

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ success: false, message: 'No candidates found' });
    }

    // Group candidates by position
    const grouped = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) acc[candidate.position] = [];
      acc[candidate.position].push({
        id: candidate._id,
        name: candidate.name,
        position: candidate.position,
        votes: candidate.votes,
        photoUrl: candidate.photoUrl || "https://via.placeholder.com/150" // fallback
      });
      return acc;
    }, {});

    res.status(200).json({ success: true, candidates: grouped });
  } catch (error) {
    console.error('❌ Error fetching candidates:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching candidates' });
  }
});

module.exports = router;
