const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    stockLevel: {
        type: Number,
        default: 0
    },
    threshold: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
