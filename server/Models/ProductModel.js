const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    modelNo: {
        type: String,
        required: true
    },
    mfgDate: {
        type: Date,
        required: true
    },
    image: {
        type: [String],
        // required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: { 
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    warrantyTermsAndConditions: {
        type: String,
        required: true
    },
    warrantyInDays: {
        type: Number,
        required: true
    },
    coverage: {
        type: String,
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Product', ProductSchema);