import React from 'react';
import ReceiptCard from '../../components/Card/ReceiptCard';

function InvoicePage() {
  const handleDownloadPDF = () => {
    // Logic to download the receipt as a PDF
    console.log("Download PDF clicked");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-12">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-5xl font-extrabold text-blue-800">Company Name</h1>
          <button
            onClick={handleDownloadPDF}
            className="bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Download PDF
          </button>
        </div>
        <hr className="mb-6"/>
        <ReceiptCard />
      </div>
    </div>
  );
}

export default InvoicePage;
