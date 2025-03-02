const Purchases = require("../Models/PurchasesModel");
const ProductModel = require("../Models/ProductModel");
const UserModel = require("../Models/UserAuthModel");
const PurchasesModel = require("../Models/PurchasesModel");


const createPurchase = async (req, res) => {
    try {
      const { userId, productId } = req.params;
      const { quantity } = req.body;
  
      // Check if the user exists
      const userExists = await UserModel.findById(userId);
      if (!userExists) {
        return res.json({ error: "User does not exist" });
      }
  
      // Check if the product exists
      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
  
      // Find an existing purchase document for the user
      let purchase = await Purchases.findOne({ userId });
  
      if (purchase) {
        // Simply push the new product into the existing products array
        purchase.products.push({ productId, quantity });
        await purchase.save();
        return res.status(200).json({ purchaseSuccess: purchase });
      } else {
        // Create a new purchase document if one doesn't exist for the user
        purchase = await Purchases.create({
          userId,
          products: [{ productId, quantity }],
        });
        return res.status(201).json({ purchaseSuccess: purchase });
      }
    } catch (error) {
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


module.exports = {
    createPurchase,
    getAllPurchases
};
