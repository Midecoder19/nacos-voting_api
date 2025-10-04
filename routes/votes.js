const express = require('express');
const router = express.Router();
const Candidate = require('../models/Candidate');
const Vote = require('../models/Vote');
const Student = require('../models/Student'); // ✅ use Student model

router.post('/', async (req, res) => {
  const { nacosId, votes } = req.body; // votes = [{ candidateId, position }]

  try {
    // 🔹 Fetch the student using nacosId
    const student = await Student.findOne({ nacosId });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // 🔹 Ensure the student has a valid NACOS ID
    if (!student.nacosId) {
      return res.status(403).json({ error: 'Only students with a valid NACOS ID are allowed to vote' });
    }

    // 🔹 Prevent multiple votes for the same position
    for (let i = 0; i < votes.length; i++) {
      const { candidateId, position } = votes[i];

      const existingVote = await Vote.findOne({ studentId: student._id, position });
      if (existingVote) {
        return res.status(400).json({ error: `You have already voted for the position: ${position}` });
      }

      // 🔹 Increment candidate votes
      const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        { $inc: { votes: 1 } },
        { new: true }
      );

      if (!candidate) {
        return res.status(404).json({ error: `Candidate not found for position: ${position}` });
      }

      // 🔹 Save the vote
      const vote = new Vote({
        studentId: student._id, // ✅ use studentId instead of userId
        candidateId,
        position
      });
      await vote.save();
    }

    res.json({ message: 'Votes successfully recorded' });
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
