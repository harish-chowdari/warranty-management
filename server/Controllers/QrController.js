const mongoose = require('mongoose');
const crypto = require('crypto');
const QRModel = require("../Models/QrModel");

const createQr = async (req, res) => {
  try {
    // Expecting productId and quantity from the request body.
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ error: 'ProductId and quantity are required' });
    }

    // Generate the QR codes for this generation batch.
    const codes = [];
    for (let i = 0; i < quantity; i++) {
      // Create a unique random string (8-character hex)
      const uniquePart = crypto.randomBytes(4).toString('hex');
      // Form the QR code with the product id and unique part.
      const qrCode = `${productId}-${uniquePart}`;
      codes.push(qrCode);
    }

    // Create a new generation batch object.
    const newBatch = {
      quantity,
      generatedAt: new Date(),  // All codes in this batch share the same generation time.
      codes
    };

    // Check if there is an existing document for this product.
    let qrDocument = await QRModel.findOne({ productId });
    
    if (qrDocument) {
      // Append the new batch to the existing document.
      qrDocument.qrBatches.push(newBatch);
      await qrDocument.save();
    } else {
      // Otherwise, create a new document with this product and batch.
      qrDocument = await QRModel.create({
        productId,
        qrBatches: [newBatch]
      });
    }

    return res.status(201).json(qrDocument);
  } catch (error) {
    console.error("Error generating QR codes:", error);
    return res.status(500).json({ error: error.message });
  }
};

 
const getQrs = async (req, res) => {
  try {
    const qrDocument = await QRModel.findOne({ productId: req.params.productId });
    if (!qrDocument) {
      return res.status(404).json({ error: 'QR document not found' });
    }
    return res.status(200).json(qrDocument);
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createQr,
  getQrs
};
