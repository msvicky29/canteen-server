require('dotenv').config();
const { sendOTP } = require('../config/nodemailer');

async function testEmail() {
    try {
        console.log('Testing email with config:', {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS ? '****' : 'missing'
        });

        const result = await sendOTP('msvicky2983@gmail.com', '1234');
        console.log('Email test result:', result);
    } catch (error) {
        console.error('Test failed:', error);
    }
}

testEmail();
