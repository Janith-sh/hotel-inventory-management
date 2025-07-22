const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const Usage = require('../models/Usage');
const Wastage = require('../models/Wastage');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Get dashboard statistics
router.get('/dashboard-stats', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        // Get total stock
        const inventoryItems = await Inventory.find({ user: userId });
        const totalStock = inventoryItems.reduce((sum, item) => sum + (item.currentStock || 0), 0);
        
        // Get current month usage
        const currentMonth = new Date();
        const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        
        const monthlyUsage = await Usage.find({
            user: userId,
            usageDate: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const totalMonthlyUsage = monthlyUsage.reduce((sum, record) => sum + record.usedQuantity, 0);
        
        // Get current month wastage
        const monthlyWastage = await Wastage.find({
            user: userId,
            wastageDate: { $gte: startOfMonth, $lte: endOfMonth }
        });
        const totalMonthlyWastage = monthlyWastage.reduce((sum, record) => sum + record.quantity, 0);
        
        // Calculate wastage rate
        const wastageRate = totalMonthlyUsage > 0 ? ((totalMonthlyWastage / totalMonthlyUsage) * 100).toFixed(1) : 0;
        
        res.json({
            totalStock,
            monthlyUsage: totalMonthlyUsage,
            monthlyWastage: totalMonthlyWastage,
            wastageRate: parseFloat(wastageRate)
        });
    } catch (error) {
        console.error('Dashboard stats error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Generate stock report
router.get('/stock-report', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        
        const inventoryItems = await Inventory.find({ user: userId });
        
        const stockReport = inventoryItems.map(item => ({
            itemName: item.name,
            category: item.category,
            department: item.department,
            currentStock: item.currentStock || 0,
            threshold: item.threshold,
            status: (item.currentStock || 0) >= item.threshold ? 'OK' : 
                   (item.currentStock || 0) < item.threshold && (item.currentStock || 0) >= item.threshold * 0.5 ? 'Low Stock' : 'Critical',
            lastUpdated: item.updatedAt
        }));
        
        // Sort by status (Critical first, then Low Stock, then OK)
        stockReport.sort((a, b) => {
            const statusOrder = { 'Critical': 0, 'Low Stock': 1, 'OK': 2 };
            return statusOrder[a.status] - statusOrder[b.status];
        });
        
        res.json({
            reportType: 'Stock Report',
            generatedAt: new Date(),
            totalItems: stockReport.length,
            criticalItems: stockReport.filter(item => item.status === 'Critical').length,
            lowStockItems: stockReport.filter(item => item.status === 'Low Stock').length,
            data: stockReport
        });
    } catch (error) {
        console.error('Stock report error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Generate usage report
router.get('/usage-report', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { startDate, endDate } = req.query;
        
        // Default to current month if no dates provided
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        
        const usageRecords = await Usage.find({
            user: userId,
            usageDate: { $gte: start, $lte: end }
        }).populate('inventoryItem', 'name category');
        
        // Group by department
        const departmentUsage = {};
        const itemUsage = {};
        
        usageRecords.forEach(record => {
            // Department breakdown
            if (!departmentUsage[record.department]) {
                departmentUsage[record.department] = {
                    totalQuantity: 0,
                    records: 0,
                    items: new Set()
                };
            }
            departmentUsage[record.department].totalQuantity += record.usedQuantity;
            departmentUsage[record.department].records += 1;
            departmentUsage[record.department].items.add(record.inventoryItem.name);
            
            // Item breakdown
            const itemName = record.inventoryItem.name;
            if (!itemUsage[itemName]) {
                itemUsage[itemName] = {
                    category: record.inventoryItem.category,
                    totalQuantity: 0,
                    departments: new Set()
                };
            }
            itemUsage[itemName].totalQuantity += record.usedQuantity;
            itemUsage[itemName].departments.add(record.department);
        });
        
        // Convert Sets to arrays for JSON response
        Object.keys(departmentUsage).forEach(dept => {
            departmentUsage[dept].uniqueItems = departmentUsage[dept].items.size;
            delete departmentUsage[dept].items;
        });
        
        Object.keys(itemUsage).forEach(item => {
            itemUsage[item].departments = Array.from(itemUsage[item].departments);
        });
        
        const totalUsage = usageRecords.reduce((sum, record) => sum + record.usedQuantity, 0);
        
        res.json({
            reportType: 'Usage Report',
            period: { start, end },
            generatedAt: new Date(),
            totalRecords: usageRecords.length,
            totalQuantityUsed: totalUsage,
            departmentBreakdown: departmentUsage,
            itemBreakdown: itemUsage,
            detailedRecords: usageRecords.map(record => ({
                date: record.usageDate,
                item: record.inventoryItem.name,
                department: record.department,
                quantity: record.usedQuantity,
                reason: record.reason,
                previousStock: record.previousStock,
                newStock: record.newStock
            }))
        });
    } catch (error) {
        console.error('Usage report error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Generate wastage report
router.get('/wastage-report', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { startDate, endDate } = req.query;
        
        // Default to current month if no dates provided
        const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const end = endDate ? new Date(endDate) : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
        
        const wastageRecords = await Wastage.find({
            user: userId,
            wastageDate: { $gte: start, $lte: end }
        }).populate('inventoryItem', 'name category');
        
        // Group by reason
        const reasonBreakdown = {};
        const departmentBreakdown = {};
        const itemBreakdown = {};
        
        wastageRecords.forEach(record => {
            // Reason breakdown
            if (!reasonBreakdown[record.wastageReason]) {
                reasonBreakdown[record.wastageReason] = {
                    totalQuantity: 0,
                    records: 0,
                    items: new Set()
                };
            }
            reasonBreakdown[record.wastageReason].totalQuantity += record.quantity;
            reasonBreakdown[record.wastageReason].records += 1;
            reasonBreakdown[record.wastageReason].items.add(record.inventoryItem.name);
            
            // Department breakdown
            if (!departmentBreakdown[record.department]) {
                departmentBreakdown[record.department] = {
                    totalQuantity: 0,
                    records: 0
                };
            }
            departmentBreakdown[record.department].totalQuantity += record.quantity;
            departmentBreakdown[record.department].records += 1;
            
            // Item breakdown
            const itemName = record.inventoryItem.name;
            if (!itemBreakdown[itemName]) {
                itemBreakdown[itemName] = {
                    category: record.inventoryItem.category,
                    totalQuantity: 0,
                    reasons: new Set()
                };
            }
            itemBreakdown[itemName].totalQuantity += record.quantity;
            itemBreakdown[itemName].reasons.add(record.wastageReason);
        });
        
        // Convert Sets to arrays for JSON response
        Object.keys(reasonBreakdown).forEach(reason => {
            reasonBreakdown[reason].uniqueItems = reasonBreakdown[reason].items.size;
            delete reasonBreakdown[reason].items;
        });
        
        Object.keys(itemBreakdown).forEach(item => {
            itemBreakdown[item].reasons = Array.from(itemBreakdown[item].reasons);
        });
        
        const totalWastage = wastageRecords.reduce((sum, record) => sum + record.quantity, 0);
        
        res.json({
            reportType: 'Wastage Report',
            period: { start, end },
            generatedAt: new Date(),
            totalRecords: wastageRecords.length,
            totalQuantityWasted: totalWastage,
            reasonBreakdown,
            departmentBreakdown,
            itemBreakdown,
            detailedRecords: wastageRecords.map(record => ({
                date: record.wastageDate,
                item: record.inventoryItem.name,
                department: record.department,
                quantity: record.quantity,
                reason: record.wastageReason,
                previousStock: record.previousStock,
                newStock: record.newStock,
                status: record.status
            }))
        });
    } catch (error) {
        console.error('Wastage report error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// Generate supplier performance report
router.get('/supplier-report', async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const { startDate, endDate } = req.query;
        
        // Default to last 6 months if no dates provided
        const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
        const end = endDate ? new Date(endDate) : new Date();
        
        const orders = await Order.find({
            user: userId,
            orderDate: { $gte: start, $lte: end }
        }).populate('inventoryItem', 'name category');
        
        const supplierPerformance = {};
        
        orders.forEach(order => {
            if (!supplierPerformance[order.supplier]) {
                supplierPerformance[order.supplier] = {
                    totalOrders: 0,
                    completedOrders: 0,
                    partialOrders: 0,
                    cancelledOrders: 0,
                    totalQuantityOrdered: 0,
                    totalQuantityReceived: 0,
                    onTimeDeliveries: 0,
                    lateDeliveries: 0,
                    items: new Set()
                };
            }
            
            const supplier = supplierPerformance[order.supplier];
            supplier.totalOrders += 1;
            supplier.totalQuantityOrdered += order.quantity;
            supplier.totalQuantityReceived += (order.receivedQuantity || 0);
            supplier.items.add(order.inventoryItem?.name || 'Unknown');
            
            // Order status tracking
            if (order.status === 'Complete') supplier.completedOrders += 1;
            else if (order.status === 'Partial') supplier.partialOrders += 1;
            else if (order.status === 'Cancelled') supplier.cancelledOrders += 1;
            
            // Delivery timing (if delivery date exists)
            if (order.deliveryDate && order.expectedDeliveryDate) {
                if (new Date(order.deliveryDate) <= new Date(order.expectedDeliveryDate)) {
                    supplier.onTimeDeliveries += 1;
                } else {
                    supplier.lateDeliveries += 1;
                }
            }
        });
        
        // Calculate performance metrics
        Object.keys(supplierPerformance).forEach(supplierName => {
            const supplier = supplierPerformance[supplierName];
            supplier.completionRate = supplier.totalOrders > 0 ? 
                ((supplier.completedOrders / supplier.totalOrders) * 100).toFixed(1) : 0;
            supplier.fulfillmentRate = supplier.totalQuantityOrdered > 0 ? 
                ((supplier.totalQuantityReceived / supplier.totalQuantityOrdered) * 100).toFixed(1) : 0;
            supplier.onTimeRate = (supplier.onTimeDeliveries + supplier.lateDeliveries) > 0 ? 
                ((supplier.onTimeDeliveries / (supplier.onTimeDeliveries + supplier.lateDeliveries)) * 100).toFixed(1) : 0;
            supplier.uniqueItems = supplier.items.size;
            delete supplier.items;
        });
        
        res.json({
            reportType: 'Supplier Performance Report',
            period: { start, end },
            generatedAt: new Date(),
            totalSuppliers: Object.keys(supplierPerformance).length,
            totalOrders: orders.length,
            supplierPerformance
        });
    } catch (error) {
        console.error('Supplier report error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
