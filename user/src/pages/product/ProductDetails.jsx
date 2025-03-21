import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios';
import { toast } from "react-hot-toast";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [allPurchased, setAllPurchased] = useState([]);
  const userId = localStorage.getItem("userId");

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/product/${productId}`);
        setProduct(response?.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [productId]);

  // Fetch user's cart
  const fetchCart = async () => {
    try {
      const response = await axios.get(`/cart/${userId}`);
      setCart(response?.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch aggregated purchases for stock calculation
  const fetchAllPurchases = async () => {
    try {
      const response = await axios.get(`/get-every-purchases`);
      setAllPurchased(response?.data || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchAllPurchases();
    }
  }, [userId]);

  // Calculate aggregated quantities for products
  const aggregatedQuantities = {};
  allPurchased.forEach(purchase => {
    purchase.products.forEach(item => {
      const { productId: pId, quantity } = item;
      aggregatedQuantities[pId] = (aggregatedQuantities[pId] || 0) + quantity;
    });
  });

  // Determine remaining stock using aggregated purchased count
  const totalPurchased = product ? aggregatedQuantities[product._id] || 0 : 0;
  const remainingStock = product ? product.quantity - totalPurchased : 0;
  const isOutOfStock = remainingStock <= 0;

  // Check if the product is already in the user's cart
  const isInCart = cart?.products?.some(item => item.productId._id === product?._id);

  // Handler for adding to cart
  const handleAddToCart = async () => {
    try {
      await axios.post(`/add-to-cart/${productId}/${userId}`, { quantity: 1 });
      toast.success("Product added to cart");
      fetchCart(); // update the cart after adding
    } catch (err) {
      console.error("Error adding product to cart:", err);
      toast.error("Failed to add product to cart");
    }
  };

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  // Use the first image if available, else a placeholder
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
                <span className="text-xl font-medium text-gray-800">{product?.brand}</span>
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
            {/* Conditional Button Rendering */}
            <div>
              {isOutOfStock ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed bg-gray-500 text-white font-bold py-3 rounded"
                >
                  Out of Stock
                </button>
              ) : isInCart ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed bg-green-500 text-white font-bold py-3 rounded"
                >
                  Already Added to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded transition duration-300"
                >
                  Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
