const express = require('express');
const router = express.Router();
const Wastage = require('../models/Wastage');
const Inventory = require('../models/inventory');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get all wastage records (filtered by user)
router.get('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Get wastage records with populated inventory details
        const wastageRecords = await Wastage.find({ user: userId })
            .populate('inventoryItem', 'name category department')
            .sort({ wastageDate: -1 });
            
        // Format the results to make them easier to use in frontend
        const formattedRecords = wastageRecords.map(record => {
            const formattedRecord = record.toObject();
            if (formattedRecord.inventoryItem && formattedRecord.inventoryItem.name) {
                formattedRecord.itemName = formattedRecord.inventoryItem.name;
            }
            return formattedRecord;
        });
        
        res.json(formattedRecords);
    } catch (error) {
        console.error('Get wastage records error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Add new wastage record and update inventory
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { inventoryId, department, quantity, wastageDate, wastageReason } = req.body;
        
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
        if (currentStock < quantity) {
            return res.status(400).json({ 
                message: 'Not enough stock available',
                available: currentStock,
                requested: quantity
            });
        }
        
        // Calculate new stock level
        const newStock = currentStock - quantity;
        
        // Update inventory stock level
        inventoryItem.currentStock = newStock;
        inventoryItem.stockLevel = newStock;
        await inventoryItem.save();
        
        // Create wastage record
        const wastageRecord = new Wastage({
            user: userId,
            inventoryItem: inventoryId,
            department,
            quantity: Number(quantity),
            wastageDate: wastageDate || new Date(),
            wastageReason: wastageReason || 'Not specified',
            previousStock: currentStock,
            newStock
        });
        
        await wastageRecord.save();
        
        // Return the record with populated inventory details
        const populatedRecord = await Wastage.findById(wastageRecord._id)
            .populate('inventoryItem', 'name category department');
            
        console.log(`Wastage recorded for ${inventoryItem.name}:`);
        console.log(`- Department: ${department}`);
        console.log(`- Reason: ${wastageReason}`);
        console.log(`- Quantity: ${quantity}`);
        console.log(`- Stock: ${currentStock} → ${newStock}`);
        
        res.status(201).json({
            message: 'Wastage recorded successfully',
            wastageRecord: populatedRecord,
            inventoryItem: {
                name: inventoryItem.name,
                previousStock: currentStock,
                newStock
            }
        });
    } catch (error) {
        console.error('Create wastage record error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

// Get wastage records by inventory item
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
        
        // Get wastage records for this item
        const wastageRecords = await Wastage.find({
            user: userId,
            inventoryItem: req.params.inventoryId
        }).sort({ wastageDate: -1 });
        
        res.json({
            item: {
                id: inventoryItem._id,
                name: inventoryItem.name,
                currentStock: inventoryItem.currentStock || 0
            },
            wastageRecords
        });
    } catch (error) {
        console.error('Get item wastage error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Update wastage status (e.g., mark as reviewed)
router.put('/:id/status', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { status } = req.body;
        
        if (!['Recorded', 'Reviewed', 'Disputed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        
        // Find and update the wastage record
        const wastageRecord = await Wastage.findOne({
            _id: req.params.id,
            user: userId
        });
        
        if (!wastageRecord) {
            return res.status(404).json({ message: 'Wastage record not found' });
        }
        
        wastageRecord.status = status;
        await wastageRecord.save();
        
        res.json({
            message: 'Wastage status updated',
            wastageRecord
        });
    } catch (error) {
        console.error('Update wastage status error:', error.message);
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
