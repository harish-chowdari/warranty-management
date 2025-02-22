import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/product/${productId}`);
        setProduct(response.data);
        console.log("Product details:", response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Use the first image in the array if available, otherwise a placeholder
  const imageUrl =
    product.image && product.image.length > 0
      ? product.image[0]
      : 'https://via.placeholder.com/400';

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="md:w-1/2">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-96 object-contain border m-2"
            />
          </div>
          {/* Product Details */}
          <div className="md:w-1/2 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              <div className="mb-4">
                <span className="text-xl text-gray-600">Brand: </span>
                <span className="text-xl font-medium text-gray-800">{product.brand}</span>
              </div>
              <div className="mb-4">
                <span className="text-xl text-gray-600">Category: </span>
                <span className="text-xl font-medium text-gray-800">{product.category}</span>
              </div>
              <div className="mb-4">
                <span className="text-xl text-gray-600">Price: </span>
                <span className="text-2xl font-semibold text-indigo-600">${product.price}</span>
              </div>
              <div className="mb-4">
                <span className="text-xl text-gray-600">Quantity: </span>
                <span className="text-xl font-medium text-gray-800">{product.quantity}</span>
              </div>
              {product.termsAndConditions && (
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Terms & Conditions</h2>
                  <p className="text-gray-700">{product.termsAndConditions}</p>
                </div>
              )}
              <div className="mb-2">
                <span className="text-sm text-gray-500">
                  Created: {new Date(product.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500">
                  Last Updated: {new Date(product.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-300">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
