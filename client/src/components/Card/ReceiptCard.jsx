import React from "react";

export default function ReceiptCard({
  paymentId,
  orderDetails = [{},{}],
  gstApplied,
  discountApplied,
  deliveryCost,
  finalAmount,
}) {
  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">Payment Receipt</h2>
        <p className="text-lg mt-2">Reference Number: {paymentId || "djfkdljfldjf"}</p>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Order Details</h3>
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-3 text-left">Product Name</th>
              <th className="border p-3 text-left">Price</th>
              <th className="border p-3 text-left">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="border p-3">{item.productName || "product name"}</td>
                <td className="border p-3">₹{item.price || 3}</td>
                <td className="border p-3">{item.quantit || 3}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          <div className="flex justify-between text-gray-700 mb-3">
            <span className="text-lg">GST Applied:</span>
            <span className="text-lg">₹{gstApplied || 'yes'}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <span className="text-lg">Discount Applied:</span>
            <span className="text-lg">-₹{discountApplied || 'yes'}</span>
          </div>
          <div className="flex justify-between text-gray-700 mb-3">
            <span className="text-lg">Delivery Cost:</span>
            <span className="text-lg">₹{deliveryCost || 50}</span>
          </div>
          <div className="flex justify-between text-gray-900 font-bold text-xl mt-4">
            <span>Final Amount:</span>
            <span>₹{finalAmount || 50}</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 p-4 text-center">
        <p className="text-sm text-gray-600">
          Thank you for your purchase!
        </p>
      </div>
    </div>
  );
}
