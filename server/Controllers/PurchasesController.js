const ProductModel = require("../Models/ProductModel");
const UserModel = require("../Models/UserAuthModel");
const PurchasesModel = require("../Models/PurchasesModel");
const nodemailer        = require('nodemailer');


const transporter = nodemailer.createTransport({
  service: 'gmail',         // e.g. 'Gmail'
  auth: {
    user: process.env.EMAIL_USER,             // your email address
    pass: process.env.EMAIL_PASSWORD              // your email password / app password
  }
});

const createPurchase = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { quantity = 1, address, paymentDetails } = req.body;
    // { cardNumber, cvv, expiryDate }

    // 1) Verify user exists
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    // 2) Verify product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 3) Find or create the purchase document
    let purchase = await PurchasesModel.findOne({ userId });

    // build the new product entry
    const newProductEntry = { productId, quantity, address, paymentDetails };

    if (purchase) {
      // append to existing
      purchase.products.push(newProductEntry);
      await purchase.save();
    } else {
      // create brand new
      purchase = await PurchasesModel.create({
        userId,
        products: [ newProductEntry ]
      });
    }

    const last4 = paymentDetails.cardNumber.slice(-4);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: `Order Confirmation: ${product.name}`,
      text: `
        Hello ${user.name},

        Thank you for your purchase!

        Order details:
        • Product: ${product.name}
        • Quantity: ${quantity}
        • Shipping Address: ${address}

        Payment Details:
        • Card ending in: **** **** **** ${last4}

        Best regards,
        Best Buy
            `.trim()
    };

    transporter.sendMail(mailOptions)
      .then(() => {
        console.log(`Confirmation email sent to ${user.email}`);
      })
      .catch(err => {
        console.error("Error sending confirmation email:", err);
      });

    // 5) Return response
    return res.status(purchase.isNew ? 201 : 200).json({
      purchaseSuccess: purchase,
      message: "Purchase recorded and confirmation email sent."
    });

  } catch (error) {
    console.error("createPurchase error:", error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllPurchases = async (req, res) => {
    try {
        const { userId } = req.params; 

        const purchases = await PurchasesModel.find({ userId }).populate('products.productId');
        
        if (!purchases) {
            return res.status(404).json({ error: "Cart not found for this user." });
        }
        
        return res.json(purchases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const getEveryPurchase = async (req, res) => {
    try {
        const purchases = await PurchasesModel.find();
        return res.json(purchases);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


module.exports = {
    createPurchase,
    getAllPurchases,
    getEveryPurchase
};
