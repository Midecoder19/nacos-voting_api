const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const Student = require('../models/Student'); // ✅ Student model

// Cast Votes
router.post('/', async (req, res) => {
  const { nacosId, votes } = req.body; // votes = [{ candidateId, position }]

  try {
    // 🔹 Find student by NACOS ID
    const student = await Student.findOne({ nacosId });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 🔹 Check NACOS ID validity
    if (!student.nacosId) {
      return res.status(403).json({ error: 'Invalid NACOS ID' });
    }

    // 🔹 Process each vote
    for (const { candidateId, position } of votes) {
      // Check if student already voted for this position
      const existingVote = await Vote.findOne({ studentId: student._id, position });
      if (existingVote) {
        return res.status(400).json({ error: `You have already voted for the ${position} position` });
      }

      // Find and increment candidate votes
      const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { votes: 1 } },
        { new: true }
      );

      if (!candidate) {
        return res.status(404).json({ error: `Candidate not found for position: ${position}` });
      }

      // Save the vote
      await new Vote({
        studentId: student._id,
        candidateId,
        position,
      }).save();
    }

    res.status(200).json({ message: '✅ Votes successfully recorded' });
  } catch (error) {
    console.error('❌ Error during voting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
