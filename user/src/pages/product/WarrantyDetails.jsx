import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';
import warranty from "../../assets/warranty1.jpg";
import Styles from './warranty.module.css';


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
    
    <div className={Styles.container}>
                <h3>Warranty Card</h3>
                <div className={Styles.card}>
                    <div className={Styles.formContainer}>
                        <div className={Styles.formGroup}>
                            <label htmlFor='purchaseAddress'>Category:</label>
                            <p className={Styles.ptag}>{item?.productId?.category}</p>
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor='productName'>Product name:</label>
                            <p className={Styles.ptag}>{item?.productId?.name}</p>
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor='purchaseDate'>Purchase Date:</label>
                            <p className={Styles.ptag}>{item?.purchaseDate?.slice(0, 10)}</p>
                        </div>
                        <div className={Styles.formGroup}>
                            <label htmlFor='warrantyPeriod'>Price:</label>
                            <p className={Styles.ptag}>{item?.productId?.price}</p>
                        </div>
                    </div>
                    <div className={Styles.imageContainer}>
                        <img src={warranty} alt="Warranty Image" className={Styles.warrantyImage} />
                        <p className={Styles.warrantyPeriod}>{warrantyInDays ? `${warrantyInDays} Days` : "N/A"}</p>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default WarrantyDetails;