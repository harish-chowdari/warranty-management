const Cart = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");


const addToCart = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        if( !product ) {
            return res.status(404).json({ error: "Product not found" });
        }
        const d = await new Cart({
            userId : req.params.userId,
            products: [{
                productId: req.params.productId,
                quantity: req.body.quantity
            }]
        }); 
        await d.save();
        return res.json(d);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const getCart = async (req, res) => {
    try {
        const products = await Cart.find();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const removeFromCart = async (req, res) => {
    try {
        const product = await Cart.findById(req.params.id);
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


module.exports = {
    addToCart,
    getCart,
    removeFromCart
}