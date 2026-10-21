import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import api from "../../api/axios.js";
import { TableSkeleton } from "../../components/Loader/Skeletons.jsx";
import { formatINR, formatDate, shortId } from "../../utils/format.js";

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const isLoggedIn = user && user.length > 0;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    let isActive = true;

    const getPayments = async () => {
      try {
        const res = await api.get("/orders/payment/");
        if (isActive && res.status === 200) {
          setPayments(res.data?.payments || []);
        }
      } catch (error) {
        console.log("could not get payments", error);
      } finally {
        if (isActive) setLoading(false);
      }
    };

    getPayments();

    return () => {
      isActive = false;
    };
  }, [isLoggedIn, navigate]);

  const showReceipt = (receipt) => {
    if (receipt) navigate("/receipt", { state: receipt });
  };

  return (
    <div className="container-page py-10">
      <h1 className="font-display text-4xl tracking-wide text-navy-900 sm:text-5xl">
        Payment History
      </h1>
      <p className="mt-2 text-navy-500">All your past purchases in one place.</p>

      <div className="mt-8">
        {loading ? (
          <TableSkeleton rows={5} cols={4} />
        ) : payments.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-4 py-20 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-navy-100">
              <ReceiptOutlinedIcon sx={{ fontSize: 40, color: "#94a3b8" }} />
            </span>
            <h2 className="text-2xl font-bold text-navy-900">
              No purchases yet
            </h2>
            <p className="max-w-sm text-navy-500">
              When you place an order, your receipts and invoices will show up
              here.
            </p>
            <button onClick={() => navigate("/")} className="btn-primary mt-2">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-navy-100">
                <thead className="bg-navy-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-100">
                  {payments.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className={`transition hover:bg-navy-50 ${
                        index % 2 === 0 ? "bg-white" : "bg-navy-50/50"
                      }`}
                    >
                      <td className="px-6 py-4 font-mono text-sm text-navy-700">
                        {shortId(payment._id)}
                      </td>
                      <td className="px-6 py-4 text-navy-700">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-navy-900">
                        {formatINR(payment.paymentAmount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => showReceipt(payment.receipt)}
                          className="btn-secondary !py-1.5 text-sm"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
