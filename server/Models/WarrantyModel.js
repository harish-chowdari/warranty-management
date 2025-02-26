const mongoose = require('mongoose');

const WarrantySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    warranties: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        purchaseProof: {
            type: String
        },
        purchaseDate: {
            type: Date
        }
    }]
}, {timestamps: true});

module.exports = mongoose.model('Warranty', WarrantySchema);    