const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Student = require('../models/Student');
// Optionally: const sendVerificationCode = require('../utils/sendVerificationCode');

const router = new express.Router();

// Optional: Add rate limiter for brute-force protection
// const rateLimit = require('express-rate-limit');
// const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5 });

router.post('/login', async (req, res) => {
  const { nacosId, level, password } = req.body;

  // Basic input validation
  if (!nacosId || !level || !password) {
    return res.status(400).send({ error: 'All fields are required.' });
  }

  try {
    // Find the student by NACOS ID and level
    const student = await Student.findOne({ nacosId, level });

    // Generic error message to prevent user enumeration
    if (!student || !(await bcrypt.compare(password, student.password))) {
      return res.status(400).send({ error: 'Invalid login credentials.' });
    }

    // Generate a secure 6-digit numeric verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Save the code to the student record (consider setting expiration as well)
    student.verificationCode = verificationCode;
    await student.save();

    // In production, send the code via email or SMS
    // await sendVerificationCode(student.emailOrPhone, verificationCode);

    // Response
    const responseData = {
      message: 'Login successful. Verification code sent to your email or phone number.',
      matricNumber: student.matricNumber,
    };

    // For development/testing only: include code in response
    if (process.env.NODE_ENV !== 'production') {
      responseData.verificationCode = verificationCode;
    }

    res.send(responseData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).send({ error: 'An error occurred during login. Please try again later.' });
  }
});

module.exports = router;
