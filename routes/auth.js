const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sendOTP } = require('../config/nodemailer');
const Admin = require('../models/Admin');

// Store OTPs temporarily (in production, use Redis or similar)
const otpStore = new Map();

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt for:', email);

        // Find admin
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin not found with email:', email);
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        console.log('Admin found:', admin.email);

        // Compare password
        const isMatch = await admin.comparePassword(password);
        console.log('Password comparison result:', isMatch);
        
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        function generateOTP() {
            return Math.floor(1000 + Math.random() * 9000).toString();
        }

        try {
            // Generate OTP using the new function
            const otp = generateOTP();
            console.log('Generated OTP:', otp);
            
            otpStore.set(email, {
                otp,
                timestamp: Date.now(),
                attempts: 0
            });

            // Send OTP via email
            await sendOTP(email, otp);
            console.log('OTP sent successfully');
            
            res.json({ message: 'OTP sent successfully' });
        } catch (emailError) {
            console.error('Error sending OTP:', emailError);
            res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error. Please try again.' });
    }
});

// Verify OTP
router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);

    if (!storedData) {
        return res.status(400).json({ message: 'OTP expired or not found' });
    }

    // Check if OTP is expired (5 minutes)
    if (Date.now() - storedData.timestamp > 5 * 60 * 1000) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'OTP expired' });
    }

    // Check if too many attempts
    if (storedData.attempts >= 3) {
        otpStore.delete(email);
        return res.status(400).json({ message: 'Too many attempts. Please request new OTP' });
    }

    // Verify OTP
    if (storedData.otp === otp) {
        otpStore.delete(email);
        res.json({ 
            message: 'OTP verified successfully',
            token: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        });
    } else {
        storedData.attempts++;
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

module.exports = router;
