const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const authRoutes = require('./routes/auth');
const voteRoutes = require('./routes/votes');
const candidateRoutes = require('./routes/candidates'); // Update path as needed
const dashboardRoutes = require('./routes/dashboardRoutes');
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api', candidateRoutes);
app.use('/api', dashboardRoutes);  // Add this line

app.get('/', (req, res) => {
  res.send('Welcome to the Voting API!');
});


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
