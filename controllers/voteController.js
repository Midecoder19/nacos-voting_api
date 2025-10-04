// controllers/voteController.js
const Student = require('../models/Student');
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');

const voteForCandidate = async (req, res) => {
  const { studentId, candidateId, position } = req.body;

  try {
    // Find the student and candidate by their IDs
    const student = await Student.findById(studentId);
    const candidate = await Candidate.findById(candidateId);

    if (!student || !candidate) {
      return res.status(404).json({ error: 'Student or candidate not found' });
    }

    // Ensure candidate belongs to the position provided
    if (candidate.position !== position) {
      return res.status(400).json({ error: `Candidate does not belong to the ${position} position` });
    }

    // Check if the student already voted for this position
    const existingVote = await Vote.findOne({ studentId: student._id, position });
    if (existingVote) {
      return res.status(400).json({ error: `You have already voted for the ${position} position` });
    }

    // Cast the vote
    candidate.votes += 1;
    await candidate.save();

    // Save the vote record
    const vote = new Vote({
      studentId: student._id,
      candidateId,
      position,
    });
    await vote.save();

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
