// const User = require('../models/User'); // Adjust the path as needed
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Replace this line



// const login = async (req, res) => {
//   const { matricNumber, password } = req.body;

//   try {
//     // Find user by matricNumber
//     const user = await User.findOne({ matricNumber });

//     if (!user) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//     // Check password
//     const isMatch = await user.comparePassword(password);

//     if (!isMatch) {
//       return res.status(401).json({ message: 'Invalid credentials' });
//     }

//  // Generate JWT token (optional, if you're using JWT for session management)
//  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//  res.status(200).json({
//    message: 'Login successful',
//    token, // Send token if using JWT
//    user: {
//      matricNumber: user.matricNumber,
//      level: user.level,
//      nacosId: user.nacosId,
//    }
//  });  } catch (error) {
//     console.error('Error during login:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { login };
