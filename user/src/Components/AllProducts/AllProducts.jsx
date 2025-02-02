import React, { useEffect, useState } from 'react';
import axios from '../../axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const AllProducts = () => {
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchAllProducts = async () => {
          try {
            const response = await axios.get('/all-products');
            setAllProducts(response.data);
          } catch (error) {
            console.error(error);
          }
        };
        fetchAllProducts();
    }, []);

    const sliderSettings = {
        dots: true,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        color: 'blue',
        autoplay: true,
        autoplaySpeed: 2000
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allProducts.map((product) => (
                    <div key={product._id} className="bg-white cursor-pointer p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                        {/* Conditionally render Slider if there are multiple images */}
                        {product.image.length > 1 ? (
                            <Slider {...sliderSettings}>
                                {product.image.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                                    </div>
                                ))}
                            </Slider>
                        ) : (
                            <img src={product.image[0]} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                        )}
                        <h2 className="text-xl font-semibold text-gray-900 mt-4">{product.name}</h2>
                        <p className="text-gray-600 mt-2">{product.description}</p>
                        <p className="text-lg font-bold text-green-600 mt-2">${product.price}</p>
                        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">Buy Now</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllProducts;
