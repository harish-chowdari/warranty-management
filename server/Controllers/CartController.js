const Cart = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");


const addToCart = async (req, res) => {
    try {
        const { productId, userId } = req.params;
        const { quantity } = req.body;

        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
            const productInCart = cart.products.find(item => item.productId.toString() === productId);

            if (productInCart) {
                productInCart.quantity += quantity;
            } else {
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            return res.json(cart);
        } else {
            cart = new Cart({
                userId,
                products: [{ productId, quantity }]
            });
            await cart.save();
            return res.json(cart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};  



const getCart = async (req, res) => {
    try {
        const { userId } = req.params; 

        const cart = await Cart.findOne({ userId }).populate('products.productId');
        
        if (!cart) {
            return res.status(404).json({ error: "Cart not found for this user." });
        }
        
        return res.json(cart);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};



const removeFromCart = async (req, res) => {
    try {
      const { productId, userId } = req.params;
  
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart" });
      }
  
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
  
      await cart.save();
      return res.json(cart);
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


module.exports = {
    addToCart,
    getCart,
    removeFromCart
}