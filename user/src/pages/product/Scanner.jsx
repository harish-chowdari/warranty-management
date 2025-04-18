import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import jsQR from "jsqr";
import axiosInstance from "../../axios";

const QrCodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState("");
  const [responseText, setResponseText] = useState("");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const handleScan = (data) => {
    if (data?.text) {
      setScanResult(data.text);
      setShowScanner(false);
    }
  };

  const handleError = (err) => {
    console.error("QR Scan error occurred:", err);
  };

  // New: handle file upload and decode QR from image
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, canvas.width, canvas.height);
        if (code?.data) {
          setScanResult(code.data);
        } else {
          setResponseText("Could not decode a QR code from that image.");
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ""; // allow re-upload of same file if needed
  };

  useEffect(() => {
    if (!scanResult) return;

    const fetchAllPurchases = async () => {
      try {
        const { data: purchases } = await axiosInstance.get(`/all-purchases/${userId}`);
        if (!purchases || purchases.length === 0) {
          setResponseText("You have not bought any products. Please purchase a product to claim warranty.");
          return;
        }
        const purchasedProducts = purchases[0].products;
        const productExists = purchasedProducts.some(
          item => item.productId._id === scanResult.slice(0, 24)
        );

        const { data: claimedQrs } = await axiosInstance.get(`/get-claimed-qrs`);
        const isClaimedExists = claimedQrs.some(item => item.qrCode === scanResult);

        if (isClaimedExists) {
          setResponseText("This QR code has already been claimed.");
        } else if (productExists) {
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

      <div className="flex space-x-4 mb-6">
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

        {/* New upload button */}
        <label className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-200 cursor-pointer">
          Upload QR Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

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

      {responseText && (
        <p className="mt-4 text-lg text-red-500">{responseText}</p>
      )}
    </div>
  );
};

export default QrCodeScanner;
