const mongoose = require('mongoose');

const ClaimedQrSchema = new mongoose.Schema({
    qrCode: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('ClaimedQr', ClaimedQrSchema);