import React, { useEffect, useState } from 'react';
import axiosInstance from '../../axios';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const DownloadQr = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [qrDocument, setQrDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axiosInstance.get("/all-products");
        setProducts(data || []);
      } catch (err) {
        console.error(err);
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
    setHasSearched(true);
    setMessage('');
    try {
      const { data } = await axiosInstance.get(`/get-qr/${selectedProduct}`);
      setQrDocument(data || { qrBatches: [] });
      if (!data.qrBatches?.length) {
        setMessage("No QR Batches found for the selected product.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch QR codes.");
      setQrDocument({ qrBatches: [] });
    }
    setLoading(false);
  };

  const handleDownloadBatch = async (batch) => {
    const codes = batch.codes; // array of code strings
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    const qrSize = 100;     // size of each QR code
    const padding = 20;     // space between QRs
    const cols = 2;
    const usableWidth = pageWidth - margin * 2;
    const colWidth = usableWidth / cols;

    let x = margin;
    let y = margin;
    for (let i = 0; i < codes.length; i++) {
      const code = codes[i];
      try {
        const dataUrl = await QRCode.toDataURL(code, { margin: 1 });
        doc.addImage(dataUrl, 'PNG', x + (colWidth - qrSize) / 2, y, qrSize, qrSize);
        // Optionally, add the raw code text below the QR:
        // doc.setFontSize(10);
        // doc.text(code, x + (colWidth - qrSize) / 2, y + qrSize + 12, {
        //   maxWidth: qrSize,
        //   align: 'center'
        // });
      } catch (err) {
        console.error("QR generation failed for", code, err);
      }

      // move to next column / row
      if ((i + 1) % cols === 0) {
        x = margin;
        y += qrSize + 30; // QR + text + extra padding
        // new page if needed
        if (y + qrSize + margin > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          y = margin;
        }
      } else {
        x += colWidth;
      }
    }

    const filename = `qr_batch_${new Date(batch.generatedAt).toISOString()}.pdf`;
    doc.save(filename);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">QR Code Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="product" className="block mb-2">Select Product</label>
            <select
              id="product"
              className="w-full border rounded p-2"
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
            >
              <option value="">-- Select a product --</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              className="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50"
              onClick={fetchQrBatches}
              disabled={loading || !selectedProduct}
            >
              {loading ? 'Loading…' : 'Fetch QR Batches'}
            </button>
          </div>
        </div>

        {qrDocument?.qrBatches?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  {['Batch #','Quantity','Date & Time','Download'].map(h => (
                    <th key={h} className="px-4 py-2 text-left text-xs font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {qrDocument?.qrBatches?.map((batch, i) => (
                  <tr key={batch._id}>
                    <td className="px-4 py-2">{i + 1}</td>
                    <td className="px-4 py-2">{batch.quantity}</td>
                    <td className="px-4 py-2">{new Date(batch.generatedAt).toLocaleString().slice(0, -3)}</td>
                    <td className="px-4 py-2 text-center">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDownloadBatch(batch)}
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasSearched && (!qrDocument?.qrBatches?.length) && (
          <div className="text-center mt-4 text-gray-600">
            No QR Batches found for the selected product.
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadQr;
