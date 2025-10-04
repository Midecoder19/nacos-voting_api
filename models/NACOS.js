const mongoose = require('mongoose');

const nacosSchema = new mongoose.Schema({
  nacosId: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('NACOS', nacosSchema);
