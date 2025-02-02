const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../Controllers/ProductController');

// Create a new product
router.post('/create-product', createProduct);

// Get all products
router.get('/all-products', getAllProducts);

// Get a single product by ID
router.get('/product/:id', getProductById);

// Update a product by ID
router.put('/update-product/:id', updateProduct);

// Delete a product by ID
router.delete('/delete-product/:id', deleteProduct);

module.exports = router;
