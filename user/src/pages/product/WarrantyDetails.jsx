import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

const WarrantyDetails = () => {
  const { state } = useLocation();
  const { item } = state || {};
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (item?.purchaseProof) {
      const img = new Image();
      img.src = item.purchaseProof;

      img.onload = () => setIsLoading(false);
      img.onerror = () => setIsLoading(false);
    }
  }, [item]);

  if (!item) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <p className="text-xl text-red-600">No warranty details available.</p>
      </div>
    );
  }

  const purchaseDate = new Date(item.purchaseDate);
  const warrantyInDays = item.productId?.warrantyInDays;
  const warrantyExpiryDate = warrantyInDays
    ? new Date(purchaseDate.getTime() + warrantyInDays * 24 * 60 * 60 * 1000)
    : null;
  const today = new Date();
  const timeDiff = warrantyExpiryDate ? warrantyExpiryDate - today : 0;
  const warrantyLeftDays = warrantyExpiryDate ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 0;

  const handleDownloadPdf = () => {
    const node = document.getElementById('pdfContent');
    
    domtoimage.toPng(node)
      .then((dataUrl) => {
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (node.offsetHeight * pdfWidth) / node.offsetWidth;

        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('warranty-details.pdf');
      })
      .catch((error) => {
        console.error("Error generating image:", error);
      });
  };

  return (
    <div className="min-h-screen bg-gray-200 flex flex-col items-center py-10">
      <div id="pdfContent" className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-4xl w-full p-5">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            {isLoading ? (
              <div className="animate-pulse bg-gray-300 h-64 w-full rounded-md"></div>
            ) : (
              <img 
                src={item.purchaseProof} 
                alt="Purchase Proof" 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Warranty Details</h1>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-700">Product Name: </span>
                <span className="text-gray-600">{item.productId?.name || "Product Name"}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Purchased On: </span>
                <span className="text-gray-600">{purchaseDate.toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Category: </span>
                <span className="text-gray-600">{item.productId?.category}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Price: </span>
                <span className="text-gray-600">₹{item.productId?.price}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Warranty Period: </span>
                <span className="text-gray-600">{warrantyInDays ? `${warrantyInDays} Days` : "N/A"}</span>
              </div>
              {warrantyExpiryDate && (
                <>
                  {warrantyLeftDays > 0 ? (
                    <>
                      <div>
                        <span className="font-semibold text-gray-700">Warranty Expires On: </span>
                        <span className="text-gray-600">{warrantyExpiryDate.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Warranty Left: </span>
                        <span className="text-gray-600">{warrantyLeftDays} Days</span>
                      </div>
                    </>
                  ) : (
                    <div>
                      <span className="font-semibold text-gray-700">Warranty Expired On: </span>
                      <span className="text-red-600">{warrantyExpiryDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex space-x-4">
        <button 
          onClick={handleDownloadPdf}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
        >
          Download PDF
        </button>
        <button 
          onClick={() => navigate(-1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition duration-300"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default WarrantyDetails;