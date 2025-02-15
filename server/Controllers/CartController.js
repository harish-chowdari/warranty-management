const Cart = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");


const addToCart = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.productId);
        const isProductExist = await Cart.findOne({ products:[{productId: req?.params?.productId}], userId: req?.params?.userId });
        
        if( !product ) {
            return res.status(404).json({ error: "Product not found" });
        }

        const isUserExist = await Cart.findOne({ userId: req?.params?.userId });
        
        if (isUserExist) {
            isUserExist.products.push({
                productId: req?.params?.productId,
                quantity: req?.body?.quantity
            });
            await isUserExist.save();
            return res.json(isUserExist);
        }
        
        if( isProductExist ) {
            return res.status(400).json({ error: "Product already exists in cart" });
        }
        
        const d = await new Cart({
            userId : req?.params?.userId,
            products: [{
                productId: req?.params?.productId,
                quantity: req?.body?.quantity
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
        const products = await Cart.findById(req?.params?.userId);
        if( !products ) {
            return res.status(404).json({ error: "Cart not found" });
        }
        
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