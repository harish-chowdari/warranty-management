const Warranty = require('../Models/WarrantyModel');
const Product = require('../Models/ProductModel');
const User = require('../Models/UserAuthModel');
const S3 = require("../s3");

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
    //   const exists = warrantyRecord.warranties.some(
    //     (w) => w.productId.toString() === productId
    //   );
    //   if (exists) return res.status(400).json({ message: "Warranty already claimed for this product" });
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
  
  module.exports = { claimWarranty, getWarranties };
  

module.exports = { 
    claimWarranty,
    getWarranties
 };
