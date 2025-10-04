const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Candidate = require('./models/Candidate');

dotenv.config();

const candidates = [
  { name: 'Alonge Muhammad Ademole', position: 'President', party: 'Party A' },
  { name: 'Jane Smith', position: 'President', party: 'Party B' },
  { name: 'Michael Adams', position: 'President', party: 'Party C' },
  { name: 'Alice Johnson', position: 'Vice President', party: 'Party A' },
  { name: 'Bob Williams', position: 'Vice President', party: 'Party B' },
  { name: 'Samuel Green', position: 'General Secretary', party: 'Party A' },
  { name: 'Lucy Brown', position: 'General Secretary', party: 'Party B' }
];


mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('MongoDB connected');
    
    // Clear existing candidates
    await Candidate.deleteMany({});
    
    // Insert new candidates
    await Candidate.insertMany(candidates);
    console.log('Candidates inserted');
    
    mongoose.connection.close();
  })
  .catch(err => console.error('MongoDB connection error:', err));
