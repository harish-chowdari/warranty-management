import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { toast } from "react-hot-toast";

const ViewCart = () => {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    const fetchCart = async () => {
        try {
        const response = await axios.get(`/cart/${userId}`);
        setCart(response?.data || []);
        } catch (err) {
        console.error("Error fetching cart:", err);
        // setError("Failed to load cart");
        }
    };
    useEffect(() => {

        fetchCart();
    }, [userId]);

    const handleIncreaseQuantity = async (productId) => {
        try {
        const response = await axios.post(`/add-to-cart/${productId}/${userId}`, {
            quantity: 1,
        });
        } catch (err) {
        console.error("Error increasing quantity:", err);
        setError("Failed to update cart");
        }
    };

    const handleDecreaseQuantity = async (productId) => {
        try {
        const response = await axios.delete(`/remove-from-cart/${productId}/${userId}`);
        } catch (err) {
        console.error("Error decreasing quantity:", err);
        setError("Failed to update cart");
        }
    };

    // if (error) {
    //     return (
    //     <div className="flex justify-center items-center h-screen">
    //         <p className="text-red-500 text-lg">{error}</p>
    //     </div>
    //     );
    // }

    if (cart?.length === 0) {
        return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-gray-600 text-lg">Your cart is empty...</p>
        </div>
        );
    }

    const totalItems = cart?.products?.reduce((acc, item) => acc + item?.quantity, 0);
    const grandTotal = cart?.products?.reduce(
        (acc, item) => acc + (item?.productId?.price * item?.quantity),
        0
    );

    const handleBuy = async (productId) => {
        try {
            const res = await axios.post(`/create-purchase/${productId}/${userId}`)
            console.log(res?.data?.purchaseSuccess)
            if(res?.data?.purchaseSuccess) {
                toast.success("Order Placed Successfully")
            }
        }
        catch (err) {
        console.error("Error checking out:", err);
        setError("Failed to checkout");
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Your Shopping Cart</h1>
        <div className="grid grid-cols-1 gap-6">
            {cart?.products?.map((item) => (
            <div key={item?._id} className="flex bg-white shadow-md rounded-lg p-4">
                <img 
                src={item?.productId?.image?.[0] || "https://via.placeholder.com/150"} 
                alt={item?.productId?.name} 
                className="w-32 h-32 object-cover rounded-lg mr-4"
                />
                <div className="flex flex-col justify-between w-full">
                    <div>
                        <h2 className="text-xl font-semibold">{item?.productId?.name}</h2>
                        <p className="text-gray-600">
                            <span className="font-medium">Category:</span> {item?.productId?.category}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Price:</span> ${item?.productId?.price}
                        </p>
                        <div className="flex items-center mt-2">
                            <span className="text-gray-600 font-medium mr-2">Quantity:</span>
                            <button
                                onClick={() => {
                                    handleDecreaseQuantity(item?.productId?._id)
                                    window.location.reload()
                                    fetchCart()
                                }}
                                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-3 py-1 rounded-l transition-colors"
                            >
                                -
                            </button>
                            <span className="px-4">{item?.quantity}</span>
                            <button
                                onClick={() => {
                                    handleIncreaseQuantity(item?.productId?._id)
                                    window.location.reload()
                                    fetchCart()
                                }}
                                className={` bg-green-500 cursor-pointer hover:bg-green-600 text-white px-3 py-1 rounded-r transition-colors`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-gray-800 font-bold">
                        Total: ${item?.productId?.price * item?.quantity}
                        </p>
                    </div>
                    <div className="flex items-center justify-end mt-4">
                    <button onClick={() => handleBuy(item?.productId?._id)}
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-300"
                    >   
                        Buy
                    </button>
                    </div>
                </div>
            </div>
            ))}
            </div>

            {/* <div className="mt-10 border-t pt-6 text-right">
                <p className="text-lg">
                <span className="font-medium">Total Items:</span> {totalItems}
                </p>
                <p className="text-lg mb-4">
                <span className="font-medium">Grand Total:</span> ${grandTotal}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition duration-300">
                Proceed to Checkout
                </button>
            </div> */}
        </div>
    );
};

export default ViewCart;
