import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { toast } from 'react-hot-toast';

const ViewCart = () => {
  const [cart, setCart] = useState({});
  const [error, setError] = useState(null);
  const [allPurchased, setAllPurchased] = useState([]);
  const [activePurchase, setActivePurchase] = useState(null); // item being checked out
  const [purchaseData, setPurchaseData] = useState({
    address: '',
    cardNumber: '',
    cvv: '',
    expiryDate: ''
  });
  const userId = localStorage.getItem("userId");

  // Fetch the user's cart
  const fetchCart = async () => {
    try {
      const { data } = await axios.get(`/cart/${userId}`);
      setCart(data || {});
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch all purchase data for aggregation
  const fetchAllPurchases = async () => {
    try {
      const { data } = await axios.get(`/get-every-purchases`);
      setAllPurchased(data || []);
    } catch (err) {
      console.error("Error fetching purchases:", err);
    }
  };

  // On mount, load cart + purchases
  useEffect(() => {
    if (userId) {
      fetchCart();
      fetchAllPurchases();
    }
  }, [userId]);

  // Aggregate total purchased per product across all users
  const aggregatedQuantities = {};
  allPurchased.forEach(purchase => {
    purchase.products.forEach(({ productId, quantity }) => {
      aggregatedQuantities[productId] = (aggregatedQuantities[productId] || 0) + quantity;
    });
  });

  // Increase quantity in cart (with no‑overstock guard)
  const handleIncreaseQuantity = async (productId, currentQuantity, availableStock) => {
    const totalPurchased = aggregatedQuantities[productId] || 0;
    const remainingStock = availableStock - totalPurchased;
    if (currentQuantity + 1 > remainingStock) {
      toast.error(`Only ${remainingStock} item(s) available`);
      return;
    }
    try {
      await axios.post(`/add-to-cart/${productId}/${userId}`, { quantity: 1 });
      fetchCart();
    } catch (err) {
      console.error("Error increasing quantity:", err);
      setError("Failed to update cart");
    }
  };

  // Decrease quantity in cart
  const handleDecreaseQuantity = async (productId) => {
    try {
      await axios.delete(`/remove-from-cart/${productId}/${userId}`);
      fetchCart();
    } catch (err) {
      console.error("Error decreasing quantity:", err);
      setError("Failed to update cart");
    }
  };

  // Open / close the modal purchase form
  const openPurchaseForm = (item) => {
    setActivePurchase(item);
    setPurchaseData({ address: '', cardNumber: '', cvv: '', expiryDate: '' });
  };
  const closePurchaseForm = () => setActivePurchase(null);

  // Submit purchase with address & paymentDetails
  const submitPurchase = async () => {
    const { quantity, productId } = activePurchase;
    const totalPurchased = aggregatedQuantities[productId._id] || 0;
    const remainingStock = productId.quantity - totalPurchased;

    // Validation
    if (quantity > remainingStock) {
      toast.error(`Only ${remainingStock} item(s) available`);
      return;
    }
    const { address, cardNumber, cvv, expiryDate } = purchaseData;
    if (!address || !cardNumber || !cvv || !expiryDate) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const payload = {
        quantity,
        address,
        paymentDetails: { cardNumber, cvv, expiryDate }
      };
      const res = await axios.post(
        `/create-purchase/${productId._id}/${userId}`,
        payload
      );
      if (res.data.purchaseSuccess) {
        toast.success("Order Placed Successfully");
        // Remove from cart
        await axios.delete(`/remove-all-from-cart/${productId._id}/${userId}`);
        // Refresh UI
        fetchCart();
        fetchAllPurchases();
        closePurchaseForm();
      }
    } catch (err) {
      console.error("Error checking out:", err);
      toast.error("Failed to checkout");
    }
  };

  // If cart is empty
  if (!cart.products || cart.products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg">Your cart is empty...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 gap-6">
        {cart.products.map((item) => {
          const { productId, quantity, _id } = item;
          const availableStock = productId.quantity;
          const totalPurchased = aggregatedQuantities[productId._id] || 0;
          const remainingStock = availableStock - totalPurchased;
          const isOutOfStock = remainingStock <= 0;

          return (
            <div key={_id} className="flex bg-white shadow-md rounded-lg p-4">
              {/* Product Image */}
              <img
                src={productId.image?.[0] || "https://via.placeholder.com/150"}
                alt={productId.name}
                className="w-32 h-32 object-cover rounded-lg mr-4"
              />

              {/* Details & Controls */}
              <div className="flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-xl font-semibold">{productId.name}</h2>
                  <p className="text-gray-600">
                    <span className="font-medium">Category:</span> {productId.category}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ${productId.price}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-gray-600 font-medium mr-2">Quantity:</span>
                    <button
                      onClick={() => handleDecreaseQuantity(productId._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4">{quantity}</span>
                    <button
                      onClick={() =>
                        handleIncreaseQuantity(
                          productId._id,
                          quantity,
                          availableStock
                        )
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total & Buy */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-gray-800 font-bold">
                    Total: ${productId.price * quantity}
                  </p>
                  {isOutOfStock ? (
                    <button
                      disabled
                      className="bg-gray-500 cursor-not-allowed text-white py-2 px-6 rounded"
                    >
                      Out of Stock
                    </button>
                  ) : (
                    <button
                      onClick={() => openPurchaseForm(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
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

      {/* Modal Purchase Form */}
      {activePurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Enter Shipping & Payment</h3>
            <div className="space-y-3">
              <textarea
                placeholder="Shipping Address"
                value={purchaseData.address}
                onChange={e => setPurchaseData(d => ({ ...d, address: e.target.value }))}
                className="w-full border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Card Number"
                value={purchaseData.cardNumber}
                onChange={e => setPurchaseData(d => ({ ...d, cardNumber: e.target.value }))}
                className="w-full border p-2 rounded"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="CVV"
                  value={purchaseData.cvv}
                  onChange={e => setPurchaseData(d => ({ ...d, cvv: e.target.value }))}
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="text"
                  placeholder="Expiry (MM/YY)"
                  value={purchaseData.expiryDate}
                  onChange={e => setPurchaseData(d => ({ ...d, expiryDate: e.target.value }))}
                  className="flex-1 border p-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closePurchaseForm}
                  className="px-4 py-2 rounded border"
                >
                  Cancel
                </button>
                <button
                  onClick={submitPurchase}
                  className="px-4 py-2 rounded bg-blue-600 text-white"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;
