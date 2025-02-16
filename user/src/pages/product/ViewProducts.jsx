import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';

const ViewProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get('/all-products');
        setAllProducts(response?.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchAllProducts();
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`/cart/${userId}`);
      setCart(response?.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  const handleAddToCart = async (productId) => {
    try {
      const response = await axios.post(`/add-to-cart/${productId}/${userId}`, {
        quantity: 1,
      });
      setCart(response?.data);
      fetchCart();
    } catch (err) {
      console.error("Error adding product to cart:", err);
      setError("Failed to update cart");
    }
  };

  // Check if the product is already in the cart
  const isProductInCart = (productId) => {
    if (!cart || !cart?.products) return false;
    return cart?.products?.some(
      (item) => item?.productId?._id === productId
    );
  };

  return (
    <div className=" bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Products</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts?.map((product) => (
          <div
            key={product?._id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition"
          >
            {product?.image?.length > 1 ? (
              <Slider {...sliderSettings}>
                {product?.image?.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={product?.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img
                src={product?.image?.[0]}
                alt={product?.name}
                className="w-full h-48 object-cover rounded-md"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-900 mt-4">{product?.name}</h2>
            <p className="text-gray-600 mt-2">{product?.termsAndConditions}</p>
            <p className="text-lg font-bold text-green-600 mt-2">${product?.price}</p>
            <div>
              {/* <button className="mt-4 cursor-pointer w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
                Buy Now
              </button> */}
              <button                
                className={`mt-4 w-full cursor-pointer ${
                  isProductInCart(product?._id)
                    ? 'bg-gray-700'
                    : 'bg-green-600 hover:bg-green-700'
                } text-white py-2 rounded-md transition`}
              >
                {isProductInCart(product?._id)
                  ? <p><Link to="/home/view-cart">View Cart </Link></p>
                  : <p onClick={() => handleAddToCart(product?._id)}>Add to Cart</p>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewProducts;
