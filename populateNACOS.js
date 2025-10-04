const mongoose = require('mongoose');
const NACOS = require('./models/NACOS');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const nacosData = [
  { nacosId: '1234' },
  { nacosId: '5678' },
  { nacosId: '9101' },
  { nacosId: '1121' },
  // Add more NACOS IDs as needed
];

async function populateNACOS() {
  try {
    await NACOS.insertMany(nacosData);
    console.log('NACOS data inserted');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error inserting NACOS data:', err);
  }
}

populateNACOS();
