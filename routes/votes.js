const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const User = require('../models/User');

router.post('/', async (req, res) => {
  const { nacosId, votes } = req.body; // votes is an array of objects with { candidateId, position }

  try {
    // Fetch the user using nacosId
    const user = await User.findOne({ nacosId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Ensure the user has a valid NACOS ID
    if (!user.nacosId) {
      return res.status(403).json({ error: 'Only users with a valid NACOS ID are allowed to vote' });
    }

    if (user.role !== 'user') {
      return res.status(403).json({ error: 'Only users are allowed to vote' });
    }

    for (let i = 0; i < votes.length; i++) {
      const { candidateId, position } = votes[i];

      // Check if the user has already voted for this position
      const existingVote = await Vote.findOne({ userId: user._id, position });

      if (existingVote) {
        return res.status(400).json({ error: `You have already voted for a candidate in the position: ${position}` });
      }

      // Increment the vote count for the candidate
      const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { votes: 1 } },
        { new: true }
      );

      if (!candidate) {
        return res.status(404).json({ error: `Candidate not found for position: ${position}` });
      }

      // Record the vote
      const vote = new Vote({ userId: user._id, candidateId, position });
      await vote.save();
    }

    res.json({ message: 'Votes successfully recorded' });
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
