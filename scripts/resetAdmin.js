const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Delete all existing admins
        await Admin.deleteMany({});
        console.log('Deleted existing admins');

        // Create new admin
        const admin = new Admin({
            email: 'msvicky2983@gmail.com',
            password: 'admin123'
        });

        await admin.save();
        console.log('New admin created successfully');

        // Verify the admin was created
        const savedAdmin = await Admin.findOne({ email: 'msvicky2983@gmail.com' });
        console.log('Saved admin:', {
            email: savedAdmin.email,
            _id: savedAdmin._id
        });

        // Test password comparison
        const isMatch = await savedAdmin.comparePassword('admin123');
        console.log('Password verification test:', isMatch);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

resetAdmin();
