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
        } catch (e) {
            console.error(e);
        }
        };
        fetchPurchases();
    }, []);

    const claimWarranty = (purchaseId, productId) => {
        console.log(`Claim warranty for purchase: ${purchaseId}, product: ${productId}`);
    };

    return (
        <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Purchases</h1>
        {purchases.length === 0 ? (
            <p className="text-gray-600">No purchases found.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {purchases.map((purchase) => (
                <div key={purchase._id} className="bg-white shadow rounded-lg p-4 border">
                <div className="mb-4">
                    <p className="text-sm text-gray-500">
                    Date: {new Date(purchase.createdAt).toLocaleString()}
                    </p>
                </div>
                <div>
                    {purchase.products.map((product) => (
                    <div key={product._id} className="flex flex-col border-t pt-3 mt-3">
                        <div className="flex items-center">
                        <img
                            src={product.productId.image[0]}
                            alt={product.productId.name}
                            className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-1">
                            <h3 className="text-md font-semibold">{product.productId.name}</h3>
                            <p className="text-sm text-gray-600">
                            Brand: {product.productId.brand}
                            </p>
                            <p className="text-sm text-gray-600">
                            Price: ₹{product.productId.price}
                            </p>
                            <p className="text-sm text-gray-600">
                            Quantity: {product.quantity}
                            </p>
                        </div>
                        </div>
                        <button
                        onClick={() => claimWarranty(purchase._id, product.productId._id)}
                        className="mt-3 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                        Claim Warranty
                        </button>
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
