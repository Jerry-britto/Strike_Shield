import React, { useEffect,useRef } from "react";
import ReceiptCard from "../../components/Card/ReceiptCard";
import { useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoicePage() {
  const location = useLocation()
  let paymentReceiptData = location.state || "";
  const navigate = useNavigate()
  const pdfRef = useRef()
  useEffect(()=>{
    if (paymentReceiptData === "") {
      navigate("/")
    }
    console.log(paymentReceiptData);
    
  })
  const handleDownloadPDF = () => {
    // Logic to download the receipt as a PDF
    console.log("Download PDF clicked");
    const input = pdfRef.current;
    html2canvas(input).then((canvas)=>{
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF('p','mm','a4',true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth/imgWidth,pdfHeight/imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      pdf.addImage(imgData,'PNG',imgX,imgY,imgWidth*ratio,imgHeight*ratio);
      pdf.save("invoice.pdf");
    })
    .catch(e=>console.log(e)
    )
  };
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center p-12">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-5xl font-extrabold text-blue-800">
            Company Name
          </h1>
          <button
            onClick={handleDownloadPDF}
            className="bg-orange-600 text-white font-semibold text-lg px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-300"
          >
            Download PDF
          </button>
        </div>
        <hr className="mb-6" />
        <div ref={pdfRef}>
          <ReceiptCard
          paymentId={paymentReceiptData.paymentId}
          discountApplied={paymentReceiptData.discount}
          deliveryCost={paymentReceiptData.deliveryCharges}
          finalAmount={paymentReceiptData.totalCost}
          orderDetails={paymentReceiptData.orderDetails}
          />
        </div>
      </div>
    </div>
  );
}


