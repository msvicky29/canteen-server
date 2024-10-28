const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Menu item name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: ['meals', 'snacks', 'beverages', 'desserts'],
            message: '{VALUE} is not a valid category'
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['available', 'unavailable'],
            message: '{VALUE} is not a valid status'
        },
        default: 'available'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
