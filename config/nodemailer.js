const nodemailer = require('nodemailer');

// Function to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create transporter with direct Gmail credentials
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'vigneswaraasubramanian@gmail.com', // your Gmail
    pass: 'nhguaanhudftxlad'  // your app password
  }
});

const sendOTP = async (email, otp) => {
    try {
        console.log('Attempting to send OTP to:', email);
        
        const mailOptions = {
            from: 'vigneswaraasubramanian@gmail.com',  // sender address
            to: email,
            subject: 'Your OTP for Verification',
            html: `
                <p>Your One-Time Password (OTP) is:</p>
                <h1 style="font-size: 40px; font-weight: bold; color: #4a4a4a;">${otp}</h1>
                <p>Please use this OTP to complete your verification process. This OTP will expire in 10 minutes.</p>
                <p>If you didn't request this OTP, please ignore this email.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID:', info.messageId);
        console.log('OTP sent:', otp);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

// Test the connection immediately
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP connection error:', error);
    } else {
        console.log('Server is ready to send emails');
    }
});

module.exports = { sendOTP, generateOTP };
