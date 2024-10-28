const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function verifyAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        const admin = await Admin.findOne({ email: 'msvicky2983@gmail.com' });
        if (admin) {
            console.log('Admin exists:', admin.email);
            // Test password
            const isMatch = await admin.comparePassword('admin123');
            console.log('Password match:', isMatch);
        } else {
            console.log('Admin not found');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

verifyAdmin();
