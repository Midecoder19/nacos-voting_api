// models/Candidate.js
const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },  // Position the candidate is contesting for
  votes: { type: Number, default: 0 },
  photoUrl: { type: String }, // 🔥 New field for candidate picture
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
