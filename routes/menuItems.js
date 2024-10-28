const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find().sort({ createdAt: -1 });
        res.status(200).json(menuItems);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: error.message });
    }
});

// Add a new menu item
router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is empty' });
        }

        console.log('Received data:', req.body);
        const { name, price, category, status } = req.body;

        // Validate required fields
        if (!name || !price || !category) {
            return res.status(400).json({ 
                message: 'Name, price, and category are required' 
            });
        }
        
        const newMenuItem = new MenuItem({
            name,
            price: Number(price),
            category,
            status: status || 'available'
        });
        
        const savedItem = await newMenuItem.save();
        console.log('Saved item:', savedItem);
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error saving menu item:', error);
        res.status(400).json({ 
            message: error.message || 'Error saving menu item' 
        });
    }
});

// Delete a menu item
router.delete('/:id', async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: 'ID is required' });
        }

        console.log('Deleting item with id:', req.params.id);
        const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
        
        if (!deletedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.status(200).json({ 
            message: 'Menu item deleted successfully',
            deletedItem 
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: error.message });
    }
});

// Update menu item status
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        
        if (!updatedItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }
        
        res.status(200).json(updatedItem);
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
