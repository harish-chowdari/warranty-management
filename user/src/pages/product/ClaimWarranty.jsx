import React, { useState, useEffect, useRef } from "react";
import axios from "../../axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";

const ClaimWarranty = () => {
  const { productId } = useParams();
  const userId = localStorage.getItem("userId");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [purchaseProof, setPurchaseProof] = useState(null);
  const [message, setMessage] = useState("");
  const [productDetails, setProductDetails] = useState(null);
  const [claimSuccessful, setClaimSuccessful] = useState(false);
  const warrantyRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("qrCode", productId);
    formData.append("purchaseDate", purchaseDate);
    formData.append("purchaseProof", purchaseProof);

    try {
      const res = await axios.post(
        `/claim-warranty/${productId?.slice(0, 24)}/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage(res?.data?.message);
      setClaimSuccessful(true);
    } catch (err) {
      setMessage(err?.response?.data?.message || "An error occurred");
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`/product/${productId?.slice(0, 24)}`);
      setProductDetails(response?.data);
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const downloadWarrantyImage = () => {
    if (warrantyRef.current) {
      html2canvas(warrantyRef.current, { scale: 2, useCORS: true })
        .then((canvas) => {
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "warranty_card.png";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            } else {
              console.error("Failed to create blob from canvas");
            }
          }, "image/png");
        })
        .catch((err) => {
          console.error("Error generating warranty image:", err);
        });
    }
  };
  

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Register Warranty</h1>
      {message && <div className="mb-4 text-center text-green-600">{message}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label htmlFor="purchaseDate" className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Date
          </label>
          <input
            type="date"
            id="purchaseDate"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="purchaseProof" className="block text-gray-700 text-sm font-bold mb-2">
            Purchase Proof
          </label>
          <input
            type="file"
            id="purchaseProof"
            accept="image/*"
            onChange={(e) => setPurchaseProof(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register Warranty
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClaimWarranty;
