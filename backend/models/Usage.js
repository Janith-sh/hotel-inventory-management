const mongoose = require('mongoose');

const usageSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    inventoryItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    usedQuantity: {
        type: Number,
        required: true,
        min: 1
    },
    usageDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    reason: {
        type: String,
        default: 'General usage'
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Usage', usageSchema);
