const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate'); 

// 🗳️ Route to handle voting
router.post('/vote/:candidateId', async (req, res) => {
  try {
    const { candidateId } = req.params;

    // Increment the vote count for the specified candidate
    const result = await Candidate.findByIdAndUpdate(
      candidateId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'Candidate not found' });
    }

    res.json({
      message: 'Vote recorded successfully',
      candidate: {
        id: result._id,
        name: result.name,
        position: result.position,
        votes: result.votes,
        photoUrl: result.photoUrl || "https://via.placeholder.com/150" // 👈 fallback
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 👥 GET all candidates grouped by position
router.get('/candidates/all', async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ position: 1 });

    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: 'No candidates found' });
    }

    // Group candidates by position
    const groupedCandidates = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = [];
      }
      acc[candidate.position].push({
        id: candidate._id,
        name: candidate.name,
        position: candidate.position,
        votes: candidate.votes,
        photoUrl: candidate.photoUrl || "https://via.placeholder.com/150" // 👈 fallback
      });
      return acc;
    }, {});

    res.status(200).json(groupedCandidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'An error occurred while fetching candidates' });
  }
});

module.exports = router;
