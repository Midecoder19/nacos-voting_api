const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  level: { type: String, enum: ['ND1', 'HND1'], required: true },
  nacosId: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('Student', studentSchema);
