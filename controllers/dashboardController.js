const Candidate = require('../models/Candidate');

const getDashboardData = async (req, res) => {
  try {
    // Get all unique positions dynamically
    const positions = await Candidate.distinct('position');

    const dashboardData = {};

    for (const position of positions) {
      dashboardData[position] = await Candidate.find({ position }).sort({ votes: -1 }).lean();
    }

    res.status(200).json(dashboardData);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getDashboardData };
