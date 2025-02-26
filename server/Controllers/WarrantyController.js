const Warranty = require('../Models/WarrantyModel');
const Product = require('../Models/ProductModel');
const User = require('../Models/UserAuthModel');
const S3 = require("../s3");
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const Emails = require('../Models/EmailsModel'); 



const claimWarranty = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const { purchaseDate } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: "Purchase proof file is required" });
    }
    const response = await S3.uploadFile(process.env.AWS_BUCKET_NAME, req.file);
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    let warrantyRecord = await Warranty.findOne({ userId });
    if (warrantyRecord) {
      warrantyRecord.warranties.push({ productId, purchaseProof: response.Location, purchaseDate });
      await warrantyRecord.save();
      return res.status(200).json({ message: "Warranty claim successful", warranty: warrantyRecord });
    } else {
      const newWarrantyRecord = new Warranty({
        userId,
        warranties: [{ productId, purchaseProof: response.Location, purchaseDate }]
      });
      await newWarrantyRecord.save();
      return res.status(200).json({ message: "Warranty claim successful", warranty: newWarrantyRecord });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const getWarranties = async (req, res) => {
  try {
    const { userId } = req.params;
    const warrantyRecord = await Warranty.findOne({ userId }).populate("warranties.productId");
    if (!warrantyRecord) {
      return res.status(404).json({ message: "No warranty records found for this user" });
    }
    return res.status(200).json({ warranty: warrantyRecord });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendWarrantyLeftMail = async () => {
  try {
    const warranties = await Warranty.find()
      .populate("warranties.productId")
      .populate("userId");

    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    const todayString = now.toISOString().split("T")[0];

    for (const warrantyRecord of warranties) {
      const user = warrantyRecord.userId;
      if (!user || !user.email) continue;

      for (const warranty of warrantyRecord.warranties) {
        const product = warranty.productId;
        // If product details are missing, skip this warranty
        if (!product) continue;
        const warrantyInDays = product.warrantyInDays;
        if (!warrantyInDays) continue;

        // Calculate dates based on purchaseDate
        const purchaseDate = new Date(warranty.purchaseDate);
        const expiryDate = new Date(purchaseDate.getTime() + warrantyInDays * oneDay);
        const warrantyLeftDays = Math.ceil((expiryDate - now) / oneDay);

        // Calculate milestone dates (20% and 80%)
        const milestone20Date = new Date(purchaseDate.getTime() + warrantyInDays * 0.2 * oneDay);
        const milestone80Date = new Date(purchaseDate.getTime() + warrantyInDays * 0.8 * oneDay);

        if (Math.abs(now - milestone20Date) < oneDay) {
          const alreadySent20 = await Emails.findOne({ 
            warrantyId: warranty._id, 
            milestone: 20, 
            dateSent: todayString 
          });
          if (!alreadySent20) {
            const subject = `Warranty Update for ${product.name} - 20% Milestone`;
            const text = `Dear ${user.name || 'User'},\n\nYour warranty for ${product.name} has reached 20% of its duration. There are approximately ${warrantyLeftDays} days remaining until it expires on ${expiryDate.toLocaleDateString()}.\n\nThank you,\nWarranty Team`;
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject,
              text
            });
            console.log(`Sent 20% milestone email to ${user.email} for warranty ${warranty._id}`);
            await new Emails({ warrantyId: warranty._id, milestone: 20, dateSent: todayString }).save();
          }
        }

        if (Math.abs(now - milestone80Date) < oneDay) {
          // Check if an 80% milestone email has already been sent today for this warranty
          const alreadySent80 = await Emails.findOne({ 
            warrantyId: warranty._id, 
            milestone: 80, 
            dateSent: todayString 
          });
          if (!alreadySent80) {
            const subject = `Warranty Update for ${product.name} - 80% Milestone`;
            const text = `Dear ${user.name || 'User'},\n\nYour warranty for ${product.name} (Warranty ID: ${warranty._id}) has reached 80% of its duration. Only about ${warrantyLeftDays} days remain until it expires on ${expiryDate.toLocaleDateString()}.\n\nPlease take any necessary action.\n\nThank you,\nWarranty Team`;
            await transporter.sendMail({
              from: process.env.EMAIL_FROM,
              to: user.email,
              subject,
              text
            });
            console.log(`Sent 80% milestone email to ${user.email} for warranty ${warranty._id}`);
            await new Emails({ warrantyId: warranty._id, milestone: 80, dateSent: todayString }).save();
          }
        }
      }
    }
    return { message: "Warranty milestone emails sent successfully" };
  } catch (error) {
    console.error("Error in sending warranty milestone emails:", error);
    throw error;
  }
};

cron.schedule("*/4 * * * * *", async () => {
  try {
    await sendWarrantyLeftMail();
  } catch (error) {
    console.error("Error in sending warranty reminder emails:", error);
  }
});

module.exports = { 
  claimWarranty,
  getWarranties,
  sendWarrantyLeftMail
};
