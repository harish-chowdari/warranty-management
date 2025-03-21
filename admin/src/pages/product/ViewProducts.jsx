import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "../../axios";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

const ViewProducts = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [allPurchased, setAllPurchased] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption, setSortOption] = useState("default");
  // currentPage now represents how many "pages" of 16 products have been loaded.
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  // Sentinel ref for infinite scrolling
  const sentinelRef = useRef(null);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("/all-products");
        setAllProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllProducts();
  }, []);

  // Fetch all purchases for aggregation
  useEffect(() => {
    const fetchAllPurchases = async () => {
      try {
        const response = await axios.get("/get-every-purchases");
        setAllPurchased(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAllPurchases();
  }, []);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const cats = allProducts.map((product) => product.category);
    return ["All Categories", ...new Set(cats)];
  }, [allProducts]);

  // Filter products by category and search query
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

  // Sort the filtered products
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

  // Instead of slicing by page, we show all products up to currentPage * productsPerPage.
  const currentProducts = useMemo(() => {
    const endIndex = currentPage * productsPerPage;
    return sortedProducts.slice(0, endIndex);
  }, [sortedProducts, currentPage]);

  // Slider settings for products with multiple images
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

  // Aggregate purchased quantities for each product.
  // This creates an object mapping productId (string) to the total quantity purchased.
  const aggregatedQuantities = {};
  allPurchased?.forEach((purchase) => {
    purchase.products.forEach((product) => {
      const { productId, quantity } = product;
      aggregatedQuantities[productId] =
        (aggregatedQuantities[productId] || 0) + quantity;
    });
  });
  console.log(aggregatedQuantities, "aggregated quantities");

  // Set up IntersectionObserver for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          // Only load more if there are still products left to show.
          if (currentProducts.length < sortedProducts.length) {
            setCurrentPage((prevPage) => prevPage + 1);
          }
        }
      },
      { rootMargin: "100px" }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [currentProducts.length, sortedProducts.length]);

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
        {currentProducts?.map((product) => {
          // Calculate available count using aggregated purchase data.
          const totalProductCount = product.quantity;
          const purchasedCount = aggregatedQuantities[product._id] || 0;
          const availableCount = totalProductCount - purchasedCount;
          
          return (
            <div
              key={product?._id}
              className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {product?.image?.length > 1 ? (
                <Slider {...sliderSettings}>
                  {product?.image.map((image, index) => (
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
                  src={product?.image[0]}
                  alt={product?.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}
              <h2 className="text-xl font-semibold text-gray-900 mt-4">
                {product?.name}
              </h2>
              <p className="text-gray-600 mt-2">{product?.description}</p>
              <p className="text-sm text-gray-700 mt-2">
                Total: {totalProductCount} | Available: {availableCount}
              </p>
              <p className="text-lg font-bold text-green-600 mt-2">
                ${product?.price}
              </p>
              <Link
                to={`/home/edit-product/${product?._id}`}
                className="mt-4 block bg-blue-600 text-white py-2 text-center rounded-md hover:bg-blue-700 transition"
              >
                Edit
              </Link>
            </div>
          );
        })}
        {currentProducts.length === 0 && (
          <p className="text-center text-gray-600 mt-4">No products found.</p>
        )}
      </div>

      {/* Sentinel element for triggering infinite scroll */}
      <div ref={sentinelRef} className="h-10"></div>
      
      {/* Optional loading indicator */}
      {currentProducts.length < sortedProducts.length && (
        <p className="text-center text-gray-600 mt-4">Loading more products...</p>
      )}
    </div>
  );
};

export default ViewProducts;
