const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Student = require('../models/Student');  // ✅ Use Student model

const router = new express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { nacosId, level, password } = req.body;

    try {
        // 🔹 Find student by nacosId and level
        const student = await Student.findOne({ nacosId, level });
        if (!student) {
            return res.status(400).send({ error: 'Invalid NACOS ID or Level' });
        }

        // 🔹 Check password
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(400).send({ error: 'Invalid Password' });
        }

        // 🔹 Generate a 6-digit verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();
        student.verificationCode = verificationCode;
        await student.save();

        // 🔹 Send success response
        res.send({
            message: 'Login Successful. Verification code sent to your email or phone number.',
            matricNumber: student.matricNumber,
            verificationCode // In production, remove this from response and send via email/SMS
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'An error occurred during login. Please try again later.' });
    }
});

module.exports = router;
