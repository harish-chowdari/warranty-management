import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';

const GenerateQr = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/all-products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      // Prepare payload with the selected product id and the quantity.
      const payload = { productId: selectedProduct, quantity };
      const response = await axiosInstance.post("/generate-qr", payload);
      setMessage('QR Codes generated successfully!');
      console.log("Generated QR Codes:", response.data);
    } catch (error) {
      console.error("Error generating QR codes:", error);
      setMessage('Failed to generate QR Codes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="mb-4 text-center">Generate QR Codes</h2>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="product" className="form-label">Select Product</label>
            <select
              id="product"
              className="form-select"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">-- Choose a product --</option>
              {products?.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
              min="1"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Generating...' : 'Generate QR Codes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GenerateQr;
