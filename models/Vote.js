const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  studentId: {  // ✅ changed from userId to studentId
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',  // ✅ reference Student instead of User
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  position: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Vote', voteSchema);
