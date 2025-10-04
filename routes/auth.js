const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const crypto = require('crypto');

const router = new express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { nacosId, level, password } = req.body;  // Do not include matricNumber in validation

    try {
        // Find the user by nacosId and level
        const user = await User.findOne({ nacosId, level });
        if (!user) {
            return res.status(400).send({ error: 'Invalid NACOS ID or Level' });
        }

        // Check if the provided password matches the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid Password' });
        }

        // Generate a verification code for the user
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-digit hexadecimal code
        user.verificationCode = verificationCode;
        await user.save();

        // Send success response, including the matric number (without using it for login logic)
        res.send({
            message: 'Login Successful. Verification code sent to your email or phone number.',
            matricNumber: user.matricNumber, // Show matricNumber but do not use for authentication
            verificationCode // You can omit this in production and send via email/SMS
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during login. Please try again later.' });
    }
});

module.exports = router;
