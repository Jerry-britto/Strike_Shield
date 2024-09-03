import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

export default function PaymentHistory({}) {
  const [payments, setPayments] = useState([]);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const getPayments = async () => {
    try {
      const res = await Axios.get(
        "http://localhost:8000/api/v1/orders/payment",
        { withCredentials: true }
      );
      if (
        res.status === 200 &&
        res.data.message === "Payments retrevied successfully"
      ) {
        console.log("payments - ", res.data.payments);

        setPayments(res.data.payments);
      }
    } catch (error) {
      console.log("could not get payments", error);
    }
  };

  useEffect(() => {
    if (user && user.length === 0) {
      // for logged out users
      navigate("/");
    } else {
      getPayments();
    }
  }, []);

  function showReceipt(receipt) {
    navigate("/receipt", { state: receipt });
  }

  return (
    <div className="mx-auto p-6 bg-orange-50 min-h-screen">
      <h2 className="text-5xl font-bold text-orange-600 mb-8 text-center">
        Payment History
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-orange-100 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-orange-600 text-white">
            <tr>
              <th className="py-3 px-5 text-left">Payment ID</th>
              <th className="py-3 px-5 text-left">Date</th>
              <th className="py-3 px-5 text-left">Amount</th>
              <th className="py-3 px-5 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment._id}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-orange-50"
                } hover:bg-orange-200`}
              >
                <td className="py-4 px-5 border-b border-orange-300 text-xl">
                  {payment._id || "payment id"}
                </td>
                <td className="py-4 px-5 border-b border-orange-300 text-xl">
                  {payment.createdAt.toString().split("T")[0] || "payment date"}
                </td>
                <td className="py-4 px-5 border-b border-orange-300 text-xl">
                ₹{payment.paymentAmount || 555555}
                </td>
                <td
                  className={`py-4 px-5 border-b border-orange-300 font-semibold text-orange-700 cursor-pointer hover:text-orange-900`}
                >
                  <button
                    className="p-4 rounded-md bg-green-100"
                    onClick={()=>showReceipt(payment.receipt)}
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
  );
}
