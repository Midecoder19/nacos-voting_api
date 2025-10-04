const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/verify-code', async (req, res) => {
    const { matricNumber, verificationCode } = req.body;

    try {
        // Find the user by matriculation number
        const user = await User.findOne({ matricNumber });
        if (!user) {
            return res.status(400).send({ error: 'Invalid matriculation number' });
        }

        // Check if the verification code matches
        if (user.verificationCode !== verificationCode) {
            return res.status(400).send({ error: 'Invalid verification code' });
        }

        // Generate a JWT token
        const token = jwt.sign({ _id: user._id }, 'your_jwt_secret', { expiresIn: '7d' });

        // Clear the verification code after successful verification
        user.verificationCode = null;
        await user.save();

        // Respond with the user info and token
        res.send({ user: { matricNumber: user.matricNumber, level: user.level }, token });
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

module.exports = router;
