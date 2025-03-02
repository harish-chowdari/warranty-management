import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import axiosInstance from "../../axios";

const QrCodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [responseText, setResponseText] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleScan = (data) => {
    if (data) {
      const scannedText = data?.text;
      setScanResult(scannedText);
      setShowScanner(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan error occurred:", err);
  };

  useEffect(() => {
    if (!scanResult) return;
    const fetchAllPurchases = async () => {
      try {
        const response = await axiosInstance.get(`/all-purchases/${userId}`);
        const purchases = response?.data;
        if (!purchases || purchases?.length === 0) {
          setResponseText("You have not bought any products. Please purchase a product to claim warranty.");
          return;
        }
        const purchasedProducts = purchases[0].products;
        const productExists = purchasedProducts.some((item) => {
          const exists = item.productId._id === scanResult?.slice(0, 24);
          console.log(exists);
          return exists;
        });

        const isClaimed = await axiosInstance.get(`/get-claimed-qrs`);
        const claimedQrs = isClaimed?.data;

        const isClaimedExists = claimedQrs.some((item) => item.qrCode === scanResult);

        if (isClaimedExists) {
          setResponseText("This QR code has already been claimed.");
          return;
        }

        console.log(productExists, "productExists");
        if (productExists) {
          setResponseText("");
          navigate(`/home/claim-warranty/${scanResult}`);
        } else {
          setResponseText("You have not bought the product. Please purchase it to claim the warranty.");
        }
      } catch (error) {
        console.error("Error fetching all purchases:", error);
        setResponseText("An error occurred while checking your purchases. Please try again later.");
      }
    };
    fetchAllPurchases();
  }, [scanResult, userId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">QR Code Scanner</h2>
      {showScanner && (
        <div className="w-full max-w-md mb-4">
          <QrScanner
            className="w-full rounded-lg shadow-md border"
            delay={300}
            onError={handleError}
            onScan={handleScan}
          />
        </div>
      )}
      {!showScanner ? (
        <button
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => {
            setScanResult("");
            setResponseText("");
            setShowScanner(true);
          }}
        >
          Scan QR Code
        </button>
      ) : (
        <button
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          onClick={() => setShowScanner(false)}
        >
          Close Scanner
        </button>
      )}
      {/* {scanResult && (
        <p className="mt-4 text-lg text-gray-700">Scanned Text: {scanResult}</p>
      )} */}
      {responseText && (
        <p className="mt-4 text-lg text-red-500">{responseText}</p>
      )}
    </div>
  );
};

export default QrCodeScanner;