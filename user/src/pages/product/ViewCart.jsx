import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { toast } from "react-hot-toast";

const ViewCart = () => {
  const [cart, setCart] = useState({});
  const [error, setError] = useState(null);
  const [allPurchased, setAllPurchased] = useState([]);
  const userId = localStorage.getItem("userId");

  // Fetch the user's cart
  const fetchCart = async () => {
    try {
      const response = await axios.get(`/cart/${userId}`);
      setCart(response?.data || {});
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch all purchase data for aggregation
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

  // for every second call fetch cart
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchCart();
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // Calculate aggregated quantities from all purchases.
  // This maps productId (as a string) to the total purchased count.
  const aggregatedQuantities = {};
  allPurchased?.forEach(purchase => {
    purchase.products.forEach(product => {
      const { productId, quantity } = product;
      aggregatedQuantities[productId] = (aggregatedQuantities[productId] || 0) + quantity;
    });
  });
  console.log(aggregatedQuantities, 'aggregated quantities');

  // Modified handler that checks available stock before increasing quantity.
  const handleIncreaseQuantity = async (productId, currentQuantity, availableStock, totalPurchased) => {
    const remainingStock = availableStock - totalPurchased;
    if (currentQuantity + 1 > remainingStock) {
      toast.error(`Only ${remainingStock} item(s) available`);
      return;
    }
    try {
      await axios.post(`/add-to-cart/${productId}/${userId}`, { quantity: 1 });
      fetchCart();
      // window.location.reload();
    } catch (err) {
      console.error("Error increasing quantity:", err);
      setError("Failed to update cart");
    }
  };

  const handleDecreaseQuantity = async (productId) => {
    try {
      await axios.delete(`/remove-from-cart/${productId}/${userId}`);
      fetchCart();
      // window.location.reload();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      setError("Failed to update cart");
    }
  };

  // Updated Buy handler that checks if cart quantity exceeds remaining stock.
  // Once purchase is successful, it removes the product from the API cart.
  const handleBuy = async (productId, quantity, remainingStock) => {
    if (quantity > remainingStock) {
      toast.error(`Your cart quantity exceeds the available stock. Only ${remainingStock} item(s) are available.`);
      return;
    }
    try {
      const res = await axios.post(`/create-purchase/${productId}/${userId}`, { quantity });
      if (res?.data?.purchaseSuccess) {
        toast.success("Order Placed Successfully");
        // Remove the purchased product from the API cart.
        await axios.delete(`/remove-from-cart/${productId}/${userId}`);
        // Re-fetch the cart and aggregated purchases to update the UI.
        fetchCart();
        fetchAllPurchases();
        // window.location.reload();
      }
    } catch (err) {
      console.error("Error checking out:", err);
      setError("Failed to checkout");
    }
  };

  // If cart is empty, display a message.
  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Your cart is empty...</p>
      </div>
    );
  }

  // Calculate total items and grand total (optional)
  const totalItems = cart.products.reduce((acc, item) => acc + item.quantity, 0);
  const grandTotal = cart.products.reduce(
    (acc, item) => acc + (item.productId.price * item.quantity),
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-6">
        {cart.products.map((item) => {
          const availableStock = item.productId.quantity;
          const totalPurchased = aggregatedQuantities[item.productId._id] || 0;
          const remainingStock = availableStock - totalPurchased;
          // isOutOfStock is true if no items are remaining.
          const isOutOfStock = remainingStock <= 0;

          return (
            <div key={item._id} className="flex bg-white shadow-md rounded-lg p-4">
              <img
                src={item.productId.image?.[0] || "https://via.placeholder.com/150"}
                alt={item.productId.name}
                className="w-32 h-32 object-cover rounded-lg mr-4"
              />
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-xl font-semibold">{item.productId.name}</h2>
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {item.productId.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ${item.productId.price}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-600 font-medium mr-2">Quantity:</span>
                    <button
                      onClick={() => handleDecreaseQuantity(item.productId._id)}
                      className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded-l transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleIncreaseQuantity(
                          item.productId._id,
                          item.quantity,
                          availableStock,
                          totalPurchased
                        )
                      }
                      className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-3 py-1 rounded-r transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-gray-800 font-bold">
                    Total: ${item.productId.price * item.quantity}
                  </p>
                </div>
                <div className="flex items-center justify-end mt-4">
                  {isOutOfStock ? (
                    <button disabled className="bg-gray-500 cursor-not-allowed text-white py-2 px-6 rounded transition duration-300">
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleBuy(item.productId._id, item.quantity, remainingStock)}
                      className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-300"
                    >
                      Buy
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Optionally, display total items and grand total */}
      {/*
      <div className="mt-10 border-t pt-6 text-right">
        <p className="text-lg">
          <span className="font-medium">Total Items:</span> {totalItems}
        </p>
        <p className="text-lg mb-4">
          <span className="font-medium">Grand Total:</span> ${grandTotal}
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-300">
          Proceed to Checkout
        </button>
      </div>
      */}
    </div>
  );
};

export default ViewCart;
