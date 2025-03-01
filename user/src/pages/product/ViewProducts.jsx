import React, { useEffect, useState, useMemo } from "react";
import axios from "../../axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const ViewProducts = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [cart, setCart] = useState(null);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("/all-products");
        setAllProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCart = async () => {
      try {
        const response = await axios.get(`/cart/${userId}`);
        setCart(response.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart");
      }
    };

    fetchAllProducts();
    fetchCart();
  }, [userId]);

  const categories = useMemo(() => {
    const cats = allProducts.map((product) => product.category);
    return ["All Categories", ...new Set(cats)];
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allProducts, selectedCategory, searchQuery]);

  const sortedProducts = useMemo(() => {
    const products = [...filteredProducts];
    switch (sortOption) {
      case "priceLowToHigh":
        return products.sort((a, b) => a.price - b.price);
      case "priceHighToLow":
        return products.sort((a, b) => b.price - a.price);
      case "nameAZ":
        return products.sort((a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
      case "nameZA":
        return products.sort((a, b) =>
          b.name.localeCompare(a.name, undefined, { sensitivity: "base" })
        );
      default:
        return products;
    }
  }, [filteredProducts, sortOption]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    return sortedProducts.slice(startIndex, startIndex + productsPerPage);
  }, [sortedProducts, currentPage]);

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

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

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

  const isProductInCart = (productId) => {
    if (!cart || !cart?.products) return false;
    return cart?.products?.some(
      (item) => item?.productId?._id === productId
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        All Products
      </h1>

      <div className="max-w-4xl mx-auto mb-6 grid grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 p-2 rounded"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="border border-gray-300 p-2 rounded"
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="border border-gray-300 p-2 rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="default">Sort by</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
          <option value="nameAZ">Name: A-Z</option>
          <option value="nameZA">Name: Z-A</option>
        </select>
        <button
          onClick={() => {
            setSearchQuery("");
            setSelectedCategory("All Categories");
            setSortOption("default");
            setCurrentPage(1);
          }}
          className="flex items-center cursor-pointer px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-300"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <div 
            key={product._id}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            {product.image && product.image.length > 1 ? (
              <Slider {...sliderSettings}>
                {product.image.map((img, index) => (
                  <div key={index}>
                    <img
                      src={img}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                ))}
              </Slider>
            ) : (
              <img onClick={() => navigate(`/home/product-details/${product._id}`)}
                src={product.image ? product.image[0] : ""}
                alt={product.name}
                className="w-full h-48 object-cover cursor-pointer rounded-md"
              />
            )}
            <h2 className="text-xl font-semibold text-gray-900 mt-4">
              {product.name}
            </h2>
            <p className="text-gray-600 mt-2">{product.termsAndConditions}</p>
            <p className="text-lg font-bold text-green-600 mt-2">
              ${product.price}
            </p>
            <div>
              <button
                className={`mt-4 w-full cursor-pointer ${
                  isProductInCart(product._id)
                    ? "bg-gray-700"
                    : "bg-green-600 hover:bg-green-700"
                } text-white py-2 rounded-md transition`}
              >
                {isProductInCart(product._id) ? (
                  <Link to="/home/view-cart">View Cart</Link>
                ) : (
                  <span onClick={() => handleAddToCart(product._id)}>
                    Add to Cart
                  </span>
                )}
              </button>
            </div>
          </div>
        ))}
        {currentProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-4">No products found.</p>
        )}
      </div>

      <div className="mt-6 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded border ${
            currentPage === 1
              ? "text-gray-400 border-gray-300"
              : "text-blue-600 border-blue-600 hover:bg-blue-100"
          }`}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "text-blue-600 border-blue-600 hover:bg-blue-100"
              }`}
            >
              {page}
            </button>
          );
        })}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded border ${
            currentPage === totalPages
              ? "text-gray-400 border-gray-300"
              : "text-blue-600 border-blue-600 hover:bg-blue-100"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ViewProducts;
