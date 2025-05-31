const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all inventory items (filtered by user)
router.get('/', async (req, res) => {
    try {
        // Get the user ID from the request (set by auth middleware)
        const userId = req.user.id || req.user._id;
        console.log('Fetching inventory for user:', userId);
        
        // Only get items belonging to the logged-in user
        const items = await Inventory.find({ user: userId });
        res.json(items);
    } catch (error) {
        console.error('Get inventory error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add new inventory item
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        console.log('Creating inventory item for user:', userId);
        
        const item = new Inventory({
            name: req.body.name,
            category: req.body.category,
            department: req.body.department,
            threshold: req.body.threshold,
            user: userId // Add the user ID from the token
        });

        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error('Create inventory error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Delete inventory item
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Make sure the item belongs to the user before deleting
        const item = await Inventory.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Check if the item belongs to the user
        if (item.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this item" });
        }

        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        console.error('Delete inventory error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update inventory item
router.put('/:id', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Make sure the item belongs to the user before updating
        const item = await Inventory.findById(req.params.id);
        
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        // Check if the item belongs to the user
        if (item.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not authorized to update this item" });
        }
        
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                category: req.body.category,
                department: req.body.department,
                threshold: req.body.threshold
                // We don't update the user field
            },
            { new: true }
        );
        
        res.json(updatedItem);
    } catch (error) {
        console.error('Update inventory error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
