const Product = require('../Models/ProductModel');
const S3 = require("../s3");
const { v4: uuidv4 } = require('uuid');

// Create Product
async function createProduct(req, res) {
    try {
        const response = await S3.uploadFile(
            process.env.AWS_BUCKET_NAME,
            req?.files?.image[0]
        );

        const { 
            name, 
            modelNo, 
            warrantyTermsAndConditions, 
            price, 
            category, 
            quantity, 
            mfgDate, 
            warrantyInDays, 
            coverage 
        } = req.body;

        const data = new Product({ 
            name, 
            modelNo, 
            mfgDate,
            warrantyTermsAndConditions, 
            warrantyInDays, 
            coverage,
            image: [response?.Location],
            price, 
            category, 
            quantity 
        });
        const d = await data.save();
        if (d) {
            return res.status(200).json({ Added: "Product added successfully" });
        }
        return res.json(d);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const editProduct = async (req, res) => {
  try {
    console.log('Req Body:', req.body);
    const { productId } = req.params;
    
    const { 
      name, 
      modelNo, 
      warrantyTermsAndConditions, 
      price, 
      category, 
      quantity, 
      mfgDate, 
      warrantyInDays, 
      coverage 
    } = req.body;

    let updatedData = {
      name,
      modelNo,
      mfgDate,
      warrantyTermsAndConditions,
      warrantyInDays,
      coverage,
      price,
      category,
      quantity
    };

    if (req.files && req.files.image && req.files.image[0]) {
      const file = req.files.image[0];
      const uniqueFileName = `${uuidv4()}_${file.originalname}`;
      const response = await S3.uploadFile(process.env.AWS_BUCKET_NAME, file, uniqueFileName);
      updatedData.image = [response.Location];
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updatedData, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};


const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        return res.json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        return res.json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};


const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        return res.json(deletedProduct);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    editProduct,
    deleteProduct,
};
