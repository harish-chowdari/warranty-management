import React, { useState, useEffect } from 'react';
import axios from '../../axios';

const ViewWarranties = () => {
  const [warrantyData, setWarrantyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await axios.get(`/all-warranties/${userId}`);
        setWarrantyData(res.data.warranty);
      } catch (err) {
        setError("Failed to fetch warranties");
      }
      setLoading(false);
    };
    fetchWarranties();
  }, []);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Warranties</h1>
      {warrantyData && warrantyData.warranties && warrantyData.warranties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {warrantyData.warranties.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img 
                src={item.purchaseProof} 
                alt="Purchase Proof" 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {item.productId && item.productId.name ? item.productId.name : "Product Name"}
                </h2>
                <p className="text-gray-600 mb-2">
                  Purchase Date: {new Date(item.purchaseDate).toLocaleDateString()}
                </p>
                {item.productId && (
                  <div className="text-gray-700">
                    <p>Brand: {item.productId.brand}</p>
                    <p>Price: ₹{item.productId.price}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No warranties found.</p>
      )}
    </div>
  );
};

export default ViewWarranties;
