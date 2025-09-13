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

// Get all inventory items (public)
router.get('/all', async (req, res) => {
    try {
        const inventoryItems = await Inventory.find().select('name currentStock minimumStock unitPrice');
        res.json(inventoryItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update inventory stock levels
router.put('/:id/stock', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { addQuantity, setQuantity, reason } = req.body;
        
        // Find the inventory item and make sure it belongs to the user
        const item = await Inventory.findOne({ _id: req.params.id, user: userId });
        
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        
        const previousStock = item.currentStock || 0;
        let newStock;
        
        if (typeof setQuantity !== 'undefined') {
            // Set absolute stock level
            newStock = Math.max(0, setQuantity);
        } else if (typeof addQuantity !== 'undefined') {
            // Add/subtract from current stock
            newStock = Math.max(0, previousStock + addQuantity);
        } else {
            return res.status(400).json({ message: "Either 'addQuantity' or 'setQuantity' must be provided" });
        }
        
        // Update both stock fields
        item.currentStock = newStock;
        item.stockLevel = newStock;
        
        await item.save();
        
        console.log(`Stock update for ${item.name}:`);
        console.log(`- Reason: ${reason || 'Stock adjustment'}`);
        console.log(`- Stock: ${previousStock} → ${newStock}`);
        
        res.json({
            message: 'Stock updated successfully',
            item: item.name,
            previousStock,
            newStock,
            change: newStock - previousStock
        });
    } catch (error) {
        console.error('Update inventory stock error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get inventory with order history for better stock tracking
router.get('/:id/details', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const Order = require('../models/Order');
        
        // Find the inventory item
        const item = await Inventory.findOne({ _id: req.params.id, user: userId });
        
        if (!item) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        
        // Find related orders
        const orders = await Order.find({ inventoryItem: req.params.id })
            .select('orderId quantity receivedQuantity status orderDate deliveryDate')
            .sort({ orderDate: -1 });
        
        // Calculate total ordered vs received
        const totalOrdered = orders.reduce((sum, order) => sum + order.quantity, 0);
        const totalReceived = orders.reduce((sum, order) => sum + (order.receivedQuantity || 0), 0);
        
        res.json({
            item: item.toObject(),
            orderHistory: orders,
            stockSummary: {
                currentStock: item.currentStock || 0,
                stockLevel: item.stockLevel || 0,
                threshold: item.threshold,
                totalOrdered,
                totalReceived,
                pendingDelivery: totalOrdered - totalReceived
            }
        });
    } catch (error) {
        console.error('Get inventory details error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
