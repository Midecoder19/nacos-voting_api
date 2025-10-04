// controllers/voteController.js
const User = require('../models/User');
const Candidate = require('../models/Candidate');

const voteForCandidate = async (req, res) => {
  const { userId, candidateId, party } = req.body;

  try {
    // Find the user and candidate by their IDs
    const user = await User.findById(userId);
    const candidate = await Candidate.findById(candidateId);

    if (!user || !candidate) {
      return res.status(404).json({ error: 'User or candidate not found' });
    }

    // Check if the candidate's position matches the party provided
    if (candidate.position !== party) {
      return res.status(400).json({ error: `Candidate does not belong to the ${party} position` });
    }

    // Check if the user has already voted for a candidate in this position
    for (const votedId of user.votedCandidates) {
      const votedCandidate = await Candidate.findById(votedId);
      if (votedCandidate.position === party) {
        return res.status(400).json({ error: `You have already voted for a candidate in the ${party} position` });
      }
    }

    // Cast the vote
    candidate.votes += 1;
    await candidate.save();

    // Add the candidate to the user's list of voted candidates
    user.votedCandidates.push(candidateId);
    await user.save();

    res.status(200).json({
      message: 'Vote cast successfully',
      candidate,
    });
  } catch (error) {
    console.error('Error casting vote:', error);
    res.status(500).json({ error: 'Error casting vote' });
  }
};

module.exports = {
  voteForCandidate,
};
