const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 

const userSchema = new mongoose.Schema({
  matricNumber: { type: String, required: true, unique: true },
  level: { type: String, required: true },
  nacosId: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'candidate'], default: 'user' }, // Added role field
  phone: { type: String },  // Optional field
  verificationCode: { type: String },
});

// Instance method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
