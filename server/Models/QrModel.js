const mongoose = require('mongoose');

const QrSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  qrBatches: [{
    quantity: { type: Number, required: true },
    generatedAt: { type: Date, default: Date.now },
    codes: [String]  // list of generated QR code strings for this batch
  }]
}, { timestamps: true });

module.exports = mongoose.model('Qr', QrSchema);
