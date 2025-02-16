const Cart = require("../Models/CartModel");
const ProductModel = require("../Models/ProductModel");


const addToCart = async (req, res) => {
    try {
        const { productId, userId } = req.params; // Extracting productId and userId from params
        const { quantity } = req.body; // Extracting quantity from the request body

        // Check if the product exists in the database
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Find the cart for the given user
        let cart = await Cart.findOne({ userId });

        // If the cart exists
        if (cart) {
            // Check if the product is already in the cart
            const productInCart = cart.products.find(item => item.productId.toString() === productId);

            if (productInCart) {
                // If found, increment the quantity
                productInCart.quantity += quantity;
            } else {
                // If not found, add the product with the provided quantity
                cart.products.push({ productId, quantity });
            }
            await cart.save();
            return res.json(cart);
        } else {
            // If no cart exists for the user, create a new one with the product
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
        const { userId } = req.params; // Extract userId from request parameters

        // Find the cart for the given user
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
  
      // Find the cart for the given user
      const cart = await Cart.findOne({ userId });
      if (!cart) {
        return res.status(404).json({ error: "Cart not found" });
      }
  
      // Find the product in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (productIndex === -1) {
        return res.status(404).json({ error: "Product not found in cart" });
      }
  
      // Reduce quantity by 1; if quantity becomes 0, remove the product from the cart
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
  
      // Save the updated cart
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