const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all inventory items with stock level information
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        console.log('Fetching stock levels for user:', userId);
        
        // Get all inventory items for the user
        const items = await Inventory.find({ user: userId });
        res.json(items);
    } catch (error) {
        console.error('Get stock levels error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
