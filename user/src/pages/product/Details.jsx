import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../axios";
import Navbar from "../../Components/Layout/Navbar";

const Details = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  // Fetch product details only.
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/product/${productId}`);
        setProduct(response.data);
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

  // Use the first image if available, otherwise use a placeholder.
  const imageUrl =
    product.image && product.image.length > 0
      ? product.image[0]
      : "https://via.placeholder.com/400";

  return (
    <div className=" mx-auto ">
    <Navbar />
      <div className="bg-white mt-8 max-w-5xl mx-auto shadow-lg rounded-lg overflow-hidden">
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
          <div className="md:w-1/2 p-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="mb-4">
              <span className="text-xl text-gray-600">Brand: </span>
              <span className="text-xl font-medium text-gray-800">
                {product.brand}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-xl text-gray-600">Category: </span>
              <span className="text-xl font-medium text-gray-800">
                {product.category}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-xl text-gray-600">Price: </span>
              <span className="text-2xl font-semibold text-indigo-600">
                ${product.price}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-xl text-gray-600">Quantity: </span>
              <span className="text-xl font-medium text-gray-800">
                {product.quantity}
              </span>
            </div>
            {product.termsAndConditions && (
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Terms & Conditions
                </h2>
                <p className="text-gray-700">
                  {product.termsAndConditions}
                </p>
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
        </div>
      </div>
    </div>
  );
};

export default Details;
