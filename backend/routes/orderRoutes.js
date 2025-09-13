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
    const userId = req.user.id || req.user._id;
    
    // Find the order and make sure it belongs to the user
    const order = await Order.findOne({ _id: req.params.id, user: userId });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Store previous received quantity for inventory adjustment
    const previousReceivedQty = order.receivedQuantity || 0;
    
    // Update order status and received quantity
    order.status = status;
    order.receivedQuantity = receivedQuantity;
    
    // Set delivery date if status is Complete or Partial
    if (status === 'Complete' || status === 'Partial') {
      order.deliveryDate = new Date();
    }
    
    // Update inventory stock levels based on delivery status
    if (status === 'Complete' || status === 'Partial' || status === 'Cancelled') {
      const inventory = await Inventory.findById(order.inventoryItem);
      if (inventory) {
        // Calculate the difference in received quantity for this order
        const qtyDifference = receivedQuantity - previousReceivedQty;
        
        console.log(`Inventory Update: ${inventory.name}`);
        console.log(`Previous received: ${previousReceivedQty}, New received: ${receivedQuantity}`);
        console.log(`Stock difference to add: ${qtyDifference}`);
        
        // Only update stock if there's actually a difference
        if (qtyDifference !== 0) {
          // Add the quantity difference to existing stock
          const currentStock = inventory.currentStock || 0;
          const newStockLevel = Math.max(0, currentStock + qtyDifference);
          
          inventory.currentStock = newStockLevel;
          inventory.stockLevel = newStockLevel;
          
          await inventory.save();
          console.log(`Updated inventory ${inventory.name}:`);
          console.log(`- Stock Level: ${currentStock} + ${qtyDifference} = ${newStockLevel}`);
        } else {
          console.log('No stock update needed - received quantity unchanged');
        }
      } else {
        console.log('Warning: Inventory item not found for order');
      }
    }
    
    await order.save();
    
    // Return the updated order with populated inventory item
    const updatedOrder = await Order.findById(order._id)
      .populate('inventoryItem', 'name category');
    
    // Format the response to include itemName
    const formattedOrder = updatedOrder.toObject();
    if (formattedOrder.inventoryItem && formattedOrder.inventoryItem.name) {
      formattedOrder.itemName = formattedOrder.inventoryItem.name;
    }
    
    res.json(formattedOrder);
  } catch (error) {
    console.error('Update order error:', error.message);
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

// Route to manually adjust inventory stock (useful for corrections)
router.put('/inventory/:inventoryId/adjust-stock', async (req, res) => {
  try {
    const { adjustment, reason } = req.body;
    const userId = req.user.id || req.user._id;
    
    // Find the inventory item and make sure it belongs to the user
    const inventory = await Inventory.findOne({ _id: req.params.inventoryId, user: userId });
    
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }
    
    const previousStock = inventory.currentStock || 0;
    const newStock = Math.max(0, previousStock + adjustment);
    
    // Update both stock fields
    inventory.currentStock = newStock;
    inventory.stockLevel = newStock;
    
    await inventory.save();
    
    console.log(`Manual stock adjustment for ${inventory.name}:`);
    console.log(`- Reason: ${reason || 'Not specified'}`);
    console.log(`- Adjustment: ${adjustment}`);
    console.log(`- Stock: ${previousStock} → ${newStock}`);
    
    res.json({
      message: 'Stock adjusted successfully',
      item: inventory.name,
      previousStock,
      newStock,
      adjustment,
      reason
    });
  } catch (error) {
    console.error('Stock adjustment error:', error.message);
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
