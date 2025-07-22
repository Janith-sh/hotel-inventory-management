const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Inventory = require('../models/inventory');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Create new order
router.post('/', async (req, res) => {
  try {
    // Get the user ID from the request (set by auth middleware)
    const userId = req.user.id || req.user._id;
    console.log('Creating order for user:', userId);

    // Create the order with the user ID
    const orderData = {
      ...req.body,
      user: userId
    };
    
    const order = new Order(orderData);
    await order.save();
    
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

// Update order status and stock
router.put('/:id/status', async (req, res) => {
  try {
    const { status, receivedQuantity } = req.body;
    const order = await Order.findById(req.params.id);
    
    order.status = status;
    order.receivedQuantity = receivedQuantity;
    
    if (status === 'Complete' || status === 'Partial') {
      order.deliveryDate = new Date();
      
      // Update inventory stock
      const inventory = await Inventory.findById(order.inventoryItem);
      if (inventory) {
        inventory.currentStock += receivedQuantity;
        inventory.stockLevel += receivedQuantity; // Update both fields
        await inventory.save();
      }
    }
    
    await order.save();
    res.json(order);  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders (filtered by user)
router.get('/', async (req, res) => {
  try {
    // Get the user ID from the request (set by auth middleware)
    const userId = req.user.id || req.user._id;
    console.log('Fetching orders for user:', userId);
    
    // Find orders and populate inventory item details
    const orders = await Order.find({ user: userId })
      .populate('inventoryItem', 'name category')
      .sort({ orderDate: -1 });
      
    // Format orders to include item name from the populated inventory item
    const formattedOrders = orders.map(order => {
      const formattedOrder = order.toObject();
      
      // Add itemName if inventoryItem is populated
      if (formattedOrder.inventoryItem && formattedOrder.inventoryItem.name) {
        formattedOrder.itemName = formattedOrder.inventoryItem.name;
      }
      
      return formattedOrder;
    });
    
    res.json(formattedOrders);
  } catch (error) {
    console.error('Get orders error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
