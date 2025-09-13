const mongoose = require('mongoose');

const wastageSchema = new mongoose.Schema({
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
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    wastageDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    wastageReason: {
        type: String,
        required: true
    },
    previousStock: {
        type: Number,
        required: true
    },
    newStock: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Recorded',
        enum: ['Recorded', 'Reviewed', 'Disputed']
    }
}, { timestamps: true });

module.exports = mongoose.model('Wastage', wastageSchema);
