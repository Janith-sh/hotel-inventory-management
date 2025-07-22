const express = require('express');
const router = express.Router();
const Usage = require('../models/Usage');
const Inventory = require('../models/inventory');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all usage records (filtered by user)
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Get usage records with populated inventory details
        const usageRecords = await Usage.find({ user: userId })
            .populate('inventoryItem', 'name category department')
            .sort({ usageDate: -1 });
            
        // Format the results to make them easier to use in frontend
        const formattedRecords = usageRecords.map(record => {
            const formattedRecord = record.toObject();
            if (formattedRecord.inventoryItem && formattedRecord.inventoryItem.name) {
                formattedRecord.itemName = formattedRecord.inventoryItem.name;
            }
            return formattedRecord;
        });
        
        res.json(formattedRecords);
    } catch (error) {
        console.error('Get usage records error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add new usage record and update inventory
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { inventoryId, department, usedQuantity, usageDate, reason } = req.body;
        
        // Find the inventory item
        const inventoryItem = await Inventory.findOne({ 
            _id: inventoryId, 
            user: userId 
        });
        
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        
        // Check if there's enough stock
        const currentStock = inventoryItem.currentStock || 0;
        if (currentStock < usedQuantity) {
            return res.status(400).json({ 
                message: 'Not enough stock available',
                available: currentStock,
                requested: usedQuantity
            });
        }
        
        // Calculate new stock level
        const newStock = currentStock - usedQuantity;
        
        // Update inventory stock level
        inventoryItem.currentStock = newStock;
        inventoryItem.stockLevel = newStock;
        await inventoryItem.save();
        
        // Create usage record
        const usageRecord = new Usage({
            user: userId,
            inventoryItem: inventoryId,
            department,
            usedQuantity: Number(usedQuantity),
            usageDate: usageDate || new Date(),
            reason: reason || 'General usage',
            previousStock: currentStock,
            newStock
        });
        
        await usageRecord.save();
        
        // Return the record with populated inventory details
        const populatedRecord = await Usage.findById(usageRecord._id)
            .populate('inventoryItem', 'name category department');
            
        console.log(`Usage recorded for ${inventoryItem.name}:`);
        console.log(`- Department: ${department}`);
        console.log(`- Quantity: ${usedQuantity}`);
        console.log(`- Stock: ${currentStock} → ${newStock}`);
        
        res.status(201).json({
            message: 'Usage recorded successfully',
            usageRecord: populatedRecord,
            inventoryItem: {
                name: inventoryItem.name,
                previousStock: currentStock,
                newStock
            }
        });
    } catch (error) {
        console.error('Create usage record error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get usage by inventory item
router.get('/by-item/:inventoryId', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Check if item exists and belongs to user
        const inventoryItem = await Inventory.findOne({
            _id: req.params.inventoryId,
            user: userId
        });
        
        if (!inventoryItem) {
            return res.status(404).json({ message: 'Inventory item not found' });
        }
        
        // Get usage records for this item
        const usageRecords = await Usage.find({
            user: userId,
            inventoryItem: req.params.inventoryId
        }).sort({ usageDate: -1 });
        
        res.json({
            item: {
                id: inventoryItem._id,
                name: inventoryItem.name,
                currentStock: inventoryItem.currentStock || 0
            },
            usageRecords
        });
    } catch (error) {
        console.error('Get item usage error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
