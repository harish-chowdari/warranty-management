import React, { useState, useEffect } from 'react';
import axios from './../../axios';

const ViewPurchases = () => {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await axios.get(`/all-purchases/${userId}`);
        setPurchases(res?.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPurchases();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        My Purchases
      </h1>
      {purchases.length === 0 ? (
        <p className="text-gray-600 text-center">No purchases found.</p>
      ) : (
        <div className="space-y-10">
          {purchases.map((purchase) => (
            <div
              key={purchase._id}
              className="bg-white shadow-lg rounded-xl p-8 border border-gray-200"
            >
              <div className="mb-0">
                {/* <p className="text-sm text-gray-500">
                  Purchased on: {new Date(purchase.createdAt).toLocaleString()}
                </p> */}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {purchase.products.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center space-x-4 p-4 border rounded-lg hover:shadow-md transition-shadow duration-300"
                  >
                    <img
                      src={product.productId.image[0]}
                      alt={product.productId.name}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {product.productId.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Brand: {product.productId.brand}
                      </p>
                      <p className="text-sm text-gray-600">
                        Price: ₹{product.productId.price}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {product.quantity}
                      </p>
                      <p className="text-sm text-gray-600">
                        Warranty:{" "}
                        {product?.productId?.warrantyInDays
                          ? `${product.productId.warrantyInDays} Days`
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPurchases;
