import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { toCanvas } from 'qrcode';

const ConvertQr = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      const firstColumnData = parsedData.slice(1).map(row => row[0]).filter(Boolean);
      setData(firstColumnData);
    };
    reader.readAsBinaryString(file);
  };

  const handleDownloadPdf = async () => {
    const pdf = new jsPDF();
    let qrPerPage = 0;
    let x = 65, y = 50;

    for (let i = 0; i < data.length; i++) {
      const canvas = document.createElement('canvas');
      await new Promise((resolve) => {
        toCanvas(canvas, data[i], { width: 80 }, (error) => {
          if (!error) {
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, 80, 80);
            qrPerPage++;
            y += 90;
            if (qrPerPage === 2) {
              pdf.addPage();
              x = 65;
              y = 50;
              qrPerPage = 0;
            }
            resolve();
          }
        });
      });
    }
    pdf.save('qrcodes.pdf');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-5">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Upload Excel File</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="mb-4" />
        <button
          onClick={handleDownloadPdf}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-md transition duration-300 w-full"
          disabled={data.length === 0}
        >
          Download QR Codes as PDF
        </button>
      </div>
    </div>
  );
};

export default ConvertQr;