const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function addAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Create admin
        const admin = new Admin({
            email: 'msvicky2983@gmail.com',
            password: 'admin123'
        });

        // Save admin
        await admin.save();
        console.log('Admin added successfully');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

// Run the function
addAdmin();
