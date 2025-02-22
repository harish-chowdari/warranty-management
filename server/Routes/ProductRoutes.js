const express = require('express');

const router = express.Router();

const {
    createProduct,
    getAllProducts,
    getProductById,
    editProduct,
    deleteProduct,
} = require('../Controllers/ProductController');

const { productUpload } = require("../multer");


// Create a new product
router.post('/create-product', productUpload, createProduct);

// Get all products
router.get('/all-products', getAllProducts);

// Get a single product by ID
router.get('/product/:id', getProductById); 

// Update a product by ID
router.put('/edit-product/:productId', productUpload, editProduct);

// Delete a product by ID
router.delete('/delete-product/:id', deleteProduct);


module.exports = router;
