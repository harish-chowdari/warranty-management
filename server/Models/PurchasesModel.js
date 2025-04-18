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
            fullAddress: {
                state: {
                    type: String
                },
                city: {
                    type: String    
                },
                area: {
                    type: String
                },
                street: {
                    type: String
                },
                pincode: {
                    type: String
                }
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