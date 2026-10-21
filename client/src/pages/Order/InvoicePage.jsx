import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DownloadIcon from "@mui/icons-material/Download";
import ReceiptCard from "../../components/Card/ReceiptCard.jsx";

export default function InvoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const paymentReceiptData = location.state || null;
  const pdfRef = useRef(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!paymentReceiptData) {
      navigate("/paymenthistory", { replace: true });
    }
  }, [paymentReceiptData, navigate]);

  // Heavy PDF libraries are loaded on-demand only when the user clicks
  // download, keeping them out of the main bundle.
  const handleDownloadPDF = async () => {
    const input = pdfRef.current;
    if (!input) return;
    setGenerating(true);
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4", true);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        20,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("strikeship-invoice.pdf");
      toast.success("Invoice downloaded");
    } catch (error) {
      console.log(error);
      toast.error("Could not generate PDF");
    } finally {
      setGenerating(false);
    }
  };

  if (!paymentReceiptData) return null;

  return (
    <div className="min-h-screen bg-navy-50 py-10">
      <div className="container-page flex flex-col items-center">
        <div className="w-full max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-3xl tracking-wide text-navy-900">
              Your Invoice
            </h1>
          </div>

          <div ref={pdfRef} className="rounded-2xl bg-white p-6 shadow-card">
            <div className="mb-5 flex items-center justify-between border-b border-navy-100 pb-4">
              <span className="font-display text-2xl tracking-wide text-brand-600">
                STRIKESHIELD
              </span>
              <span className="text-sm text-navy-400">
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <ReceiptCard
              paymentId={paymentReceiptData.paymentId}
              discountApplied={paymentReceiptData.discount}
              deliveryCost={paymentReceiptData.deliveryCharges}
              finalAmount={paymentReceiptData.totalCost}
              orderDetails={paymentReceiptData.orderDetails}
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleDownloadPDF}
              disabled={generating}
              className="btn-primary flex-1"
            >
              <DownloadIcon fontSize="small" />
              {generating ? "Preparing PDF…" : "Download PDF"}
            </button>
            <button
              onClick={() => navigate("/paymenthistory")}
              className="btn-secondary flex-1"
            >
              View Purchase History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
