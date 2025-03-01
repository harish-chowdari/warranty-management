import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import * as XLSX from 'xlsx';

const DownloadQr = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qrDocument, setQrDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false); // tracks if button was clicked

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axiosInstance.get("/all-products");
        setProducts(response?.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const fetchQrBatches = async () => {
    if (!selectedProduct) {
      setMessage("Please select a product.");
      return;
    }
    setLoading(true);
    setMessage('');
    setHasSearched(true);
    try {
      const response = await axiosInstance.get(`/get-qr/${selectedProduct}`);
      // Assuming response.data is an object with a qrBatches property (an array)
      setQrDocument(response.data || { qrBatches: [] });
      if (!response.data.qrBatches || response.data.qrBatches.length === 0) {
        setMessage("No QR Batches found for the selected product.");
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      setMessage("Failed to fetch QR codes.");
      setQrDocument({ qrBatches: [] });
    }
    setLoading(false);
  };

  const handleDownloadBatch = (batch) => {
    const data = batch.codes.map((code) => ({ "QR Code": code }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "QR Codes");
    const workbookOutput = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([workbookOutput], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `qr_batch_${new Date(batch.generatedAt).toISOString()}.xlsx`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">QR Code Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="product" className="block text-gray-700 font-medium mb-2">Select Product</label>
            <select
              id="product"
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">-- Select a product --</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={fetchQrBatches}
              disabled={loading || !selectedProduct}
            >
              {loading ? 'Loading...' : 'Fetch QR Batches'}
            </button>
          </div>
        </div>

        {/* Display the table if there are QR batches */}
        {qrDocument && qrDocument.qrBatches && qrDocument.qrBatches.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch #</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Download</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {qrDocument.qrBatches.map((batch, index) => (
                  <tr key={batch._id}>
                    <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{batch.quantity}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(batch.generatedAt).toLocaleString().slice(0, -3)}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={() => handleDownloadBatch(batch)}
                      >
                        Download Excel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Display condition-based message only after button interaction */}
        {hasSearched && qrDocument && (!qrDocument.qrBatches || qrDocument.qrBatches.length === 0) && (
          <div className="text-center text-gray-600 mt-4">
            { "No QR Batches found for the selected product."}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadQr;
