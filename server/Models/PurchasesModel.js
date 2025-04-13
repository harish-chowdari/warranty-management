const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    products : [
        {
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            },
            address: {
                type: String,
            },
            paymentDetails: {
                cardNumber: {
                    type: String
                },
                cvv: {
                    type: String
                },
                expiryDate: {
                    type: String
                }
            }
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Purchases', PurchaseSchema);