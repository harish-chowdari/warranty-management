const Purchases = require("../Models/PurchasesModel");
const ProductModel = require("../Models/ProductModel");
const UserModel = require("../Models/UserAuthModel");
const PurchasesModel = require("../Models/PurchasesModel");


const createPurchase = async (req, res) => {
    try {
        const { userId, productId } = req.params
        const {quantity} = req.body

        const isUserExist = await UserModel.findById(userId)

        if(!isUserExist) {
            return res.json({error: "User does not exist"})
        }
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const products = [{ productId, quantity: quantity }];
        const purchase = await Purchases.create({ userId, products });
        return res.status(201).json({ purchaseSuccess: purchase });

    } catch (error) {
        res.status(500).json({ error: error.message });
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
