const Product = require('../Models/ProductModel');

const S3 = require("../s3");


async function createProduct(req, res) {
    try {
        const response = await S3.uploadFile(        
            process.env.AWS_BUCKET_NAME,
            req?.files?.image[0]
        );

        const { name, brand, termsAndConditions, image, price, category, quantity } = req.body; 

        const data = new Product({ name, brand, termsAndConditions, image: response?.Location, price, category, quantity });
        const d = await data.save();
        if (d) {
            return res.status(200).json({ Added: "Product added successfully" });
        }
        return res.json(d);
    } catch (error) {
        console.log(error);
    }
}


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        return res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}


const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        return res.json(deletedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}





module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
}
